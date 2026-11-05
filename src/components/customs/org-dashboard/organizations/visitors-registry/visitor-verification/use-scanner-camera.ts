"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/**
 * Camera lifecycle for the `@yudiel/react-qr-scanner` <Scanner>.
 *
 * Why this exists — the library has a few sharp edges this works around:
 * - It merges our constraints over defaults that include `min: 640` width AND
 *   height, which many front cameras can't satisfy → OverconstrainedError.
 *   We always override width/height with `ideal` values.
 * - After any start failure its internal task queue stays rejected, so that
 *   <Scanner> instance can never start a camera again. Every (re)start or
 *   switch therefore remounts it via `scannerKey`.
 * - If start fails after the stream was obtained (e.g. its 3s play timeout),
 *   the stream is never stopped and keeps the camera busy. We stop whatever
 *   stream is attached to the <video> ourselves before every remount.
 * - Opening a second camera while one is live fails on many phones, so we
 *   never "probe" cameras — we switch by stopping the live stream first.
 */

export type FacingMode = "user" | "environment"
export type CameraStatus = "idle" | "starting" | "live" | "switching" | "error"

type CameraTarget =
  | { kind: "facing"; facing: FacingMode; exact: boolean }
  | { kind: "device"; deviceId: string; facing: FacingMode }
  | { kind: "any"; facing: FacingMode }

type Phase = "start" | "switch" | "revert"

/**
 * Overrides the library's `min: 640` width/height defaults. 960×540 is plenty
 * for QR codes and keeps each decode ~45% cheaper than 720p, so more frames get
 * checked per second. `ideal` (not `min`) so no camera is rejected for it.
 */
const SIZE: MediaTrackConstraints = {
//   width: { ideal: 960 },
//   height: { ideal: 540 },
  width: { ideal: 1280 },
  height: { ideal: 720 },
}

/** Pause between releasing one camera and opening the next. */
const RELEASE_DELAY_MS = 350

function toConstraints(target: CameraTarget): MediaTrackConstraints {
  switch (target.kind) {
    case "facing":
      return {
        ...SIZE,
        facingMode: target.exact ? { exact: target.facing } : { ideal: target.facing },
      }
    case "device":
      return { ...SIZE, facingMode: undefined, deviceId: { exact: target.deviceId } }
    case "any":
      return { ...SIZE, facingMode: undefined }
  }
}

function facingFromLabel(label: string): FacingMode | null {
  if (/back|rear|environment|world/i.test(label)) return "environment"
  if (/front|user|facetime|selfie/i.test(label)) return "user"
  return null
}

function errorName(error: unknown): string {
  return (error as { name?: string })?.name ?? ""
}

function errorText(error: unknown): string {
  return String((error as { message?: string })?.message ?? error ?? "")
}

/** Errors that no amount of retrying with other constraints will fix. */
function isFatal(error: unknown): boolean {
  const name = errorName(error)
  return (
    name === "NotAllowedError" ||
    name === "SecurityError" ||
    /secure context|no Stream API/i.test(errorText(error))
  )
}

export function describeCameraError(error: unknown): string {
  const name = errorName(error)
  const text = errorText(error)
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Camera permission was blocked. Allow camera access for this site in your browser settings, then try again."
  if (/secure context/i.test(text))
    return "The camera only works over a secure (HTTPS) connection."
  if (/no Stream API/i.test(text))
    return "This browser doesn't support camera access. Try Chrome or Safari."
  if (name === "NotFoundError" || name === "DevicesNotFoundError")
    return "No camera was found on this device."
  if (name === "NotReadableError" || name === "TrackStartError" || name === "AbortError")
    return "The camera is being used by another app or browser tab. Close it and try again."
  if (name === "OverconstrainedError")
    return "This camera doesn't support the required settings."
  if (/timed out/i.test(text))
    return "The camera took too long to start. Please try again."
  return "The camera couldn't be started. Please try again."
}

function stopVideoIn(container: HTMLElement | null) {
  const video = container?.querySelector("video")
  const stream = video?.srcObject as MediaStream | null | undefined
  stream?.getTracks().forEach((track) => track.stop())
}

export function useScannerCamera(initialFacing: FacingMode = "user") {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [status, setStatusState] = useState<CameraStatus>("idle")
  const [target, setTarget] = useState<CameraTarget>({
    kind: "facing",
    facing: initialFacing,
    exact: false,
  })
  const [scannerKey, setScannerKey] = useState(0)
  /** False until the first target of a session is mounted (avoids a stray getUserMedia). */
  const [scannerReady, setScannerReady] = useState(false)
  const [activeFacing, setActiveFacing] = useState<FacingMode>(initialFacing)
  const [pendingFacing, setPendingFacing] = useState<FacingMode | null>(null)
  const [canSwitch, setCanSwitch] = useState(false)
  const [error, setError] = useState<string | null>(null)
  /** Non-fatal message, e.g. a switch that failed and was rolled back. */
  const [notice, setNotice] = useState<string | null>(null)

  // Refs mirror state for use inside async callbacks / event handlers.
  const statusRef = useRef<CameraStatus>("idle")
  const targetRef = useRef<CameraTarget>(target)
  const phaseRef = useRef<Phase>("start")
  const fallbacksRef = useRef<CameraTarget[]>([])
  const lastGoodTargetRef = useRef<CameraTarget | null>(null)
  const lastGoodFacingRef = useRef<FacingMode>(initialFacing)
  const devicesRef = useRef<MediaDeviceInfo[]>([])
  const currentDeviceIdRef = useRef<string | null>(null)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const trackCleanupRef = useRef<(() => void) | null>(null)

  const setStatus = useCallback((next: CameraStatus) => {
    statusRef.current = next
    setStatusState(next)
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id)
      fn()
    }, ms)
    timersRef.current.add(id)
  }, [])

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
  }, [])

  const detachTrack = useCallback(() => {
    trackCleanupRef.current?.()
    trackCleanupRef.current = null
  }, [])

  /** Release the current camera, then (re)mount the scanner on `next`. */
  const mountTarget = useCallback(
    (next: CameraTarget, delayMs: number) => {
      detachTrack()
      stopVideoIn(containerRef.current)
      later(() => {
        targetRef.current = next
        setTarget(next)
        setScannerKey((k) => k + 1)
        setScannerReady(true)
      }, delayMs)
    },
    [detachTrack, later],
  )

  const start = useCallback(
    (facing: FacingMode = lastGoodFacingRef.current) => {
      clearAllTimers()
      setScannerReady(false)
      setError(null)
      setNotice(null)
      setPendingFacing(null)
      setStatus("starting")
      phaseRef.current = "start"
      const preferred: CameraTarget = { kind: "facing", facing, exact: false }
      // If the preferred camera fails for a recoverable reason: retry it once
      // (the camera may still be releasing), then accept any camera.
      fallbacksRef.current = [preferred, { kind: "any", facing }]
      mountTarget(preferred, statusRef.current === "idle" ? 0 : RELEASE_DELAY_MS)
    },
    [clearAllTimers, mountTarget, setStatus],
  )

  const stop = useCallback(() => {
    clearAllTimers()
    detachTrack()
    stopVideoIn(containerRef.current)
    fallbacksRef.current = []
    setScannerReady(false)
    setPendingFacing(null)
    setError(null)
    setNotice(null)
    setStatus("idle")
  }, [clearAllTimers, detachTrack, setStatus])

  const switchCamera = useCallback(() => {
    if (statusRef.current !== "live") return
    const next: FacingMode = activeFacing === "user" ? "environment" : "user"
    const currentId = currentDeviceIdRef.current
    const others = devicesRef.current.filter((d) => d.deviceId && d.deviceId !== currentId)
    const labelled = others.find((d) => facingFromLabel(d.label) === next)
    const fallbackDevice = labelled ?? others[0]

    phaseRef.current = "switch"
    // facingMode lets phones pick their main camera (not ultra-wide/tele);
    // laptops/USB cameras that don't report facing fall back to a device id.
    const first: CameraTarget = { kind: "facing", facing: next, exact: true }
    fallbacksRef.current = fallbackDevice
      ? [{ kind: "device", deviceId: fallbackDevice.deviceId, facing: next }]
      : []

    setNotice(null)
    setPendingFacing(next)
    setStatus("switching")
    mountTarget(first, RELEASE_DELAY_MS)
  }, [activeFacing, mountTarget, setStatus])

  const handleError = useCallback(
    (err: unknown) => {
      if (statusRef.current === "idle") return
      console.error("QR scanner camera error:", err)

      const fallback = !isFatal(err) ? fallbacksRef.current.shift() : undefined
      if (fallback) {
        mountTarget(fallback, RELEASE_DELAY_MS)
        return
      }

      if (phaseRef.current === "switch" && lastGoodTargetRef.current && !isFatal(err)) {
        // Couldn't reach the other camera: go back to the one that worked.
        const failed = pendingFacing ?? (activeFacing === "user" ? "environment" : "user")
        phaseRef.current = "revert"
        fallbacksRef.current = []
        setNotice(
          `Couldn't switch to the ${failed === "user" ? "front" : "back"} camera, so the ${
            lastGoodFacingRef.current === "user" ? "front" : "back"
          } camera is still in use.`,
        )
        setPendingFacing(lastGoodFacingRef.current)
        mountTarget(lastGoodTargetRef.current, RELEASE_DELAY_MS)
        return
      }

      detachTrack()
      stopVideoIn(containerRef.current)
      setPendingFacing(null)
      setError(describeCameraError(err))
      setStatus("error")
    },
    [activeFacing, detachTrack, mountTarget, pendingFacing, setStatus],
  )

  /** Wire to `onPlayingCapture` on the element wrapping <Scanner>. */
  const handlePlaying = useCallback(
    (event: React.SyntheticEvent<HTMLElement>) => {
      const video = event.target as HTMLVideoElement
      const s = statusRef.current
      if (s !== "starting" && s !== "switching") return

      const track = (video.srcObject as MediaStream | null)?.getVideoTracks()[0]
      const settings = track?.getSettings?.() ?? {}
      const requested = targetRef.current.facing
      const reported =
        settings.facingMode === "user" || settings.facingMode === "environment"
          ? settings.facingMode
          : null
      const facing = reported ?? facingFromLabel(track?.label ?? "") ?? requested

      currentDeviceIdRef.current = settings.deviceId ?? null
      lastGoodTargetRef.current = targetRef.current
      lastGoodFacingRef.current = facing
      fallbacksRef.current = []
      setActiveFacing(facing)
      setPendingFacing(null)
      setStatus("live")

      // Labels are only available once permission is granted, i.e. now.
      navigator.mediaDevices
        ?.enumerateDevices()
        .then((devices) => {
          const inputs = devices.filter((d) => d.kind === "videoinput")
          devicesRef.current = inputs
          setCanSwitch(inputs.length > 1)
        })
        .catch(() => setCanSwitch(false))

      // Surface cameras that drop mid-session (unplugged, taken by another app).
      detachTrack()
      if (track) {
        const onEnded = () => {
          if (statusRef.current === "live") {
            setError("The camera was disconnected or taken by another app.")
            setStatus("error")
          }
        }
        track.addEventListener("ended", onEnded)
        trackCleanupRef.current = () => track.removeEventListener("ended", onEnded)
      }
    },
    [detachTrack, setStatus],
  )

  // Release everything on unmount.
  useEffect(() => {
    const container = containerRef
    return () => {
      clearAllTimers()
      detachTrack()
      stopVideoIn(container.current)
    }
  }, [clearAllTimers, detachTrack])

  const constraints = useMemo(() => toConstraints(target), [target])

  return {
    containerRef,
    status,
    /** Scanner should be mounted (camera requested or running). */
    isActive: status === "starting" || status === "live" || status === "switching",
    scannerKey,
    /** Render <Scanner> only when true. */
    scannerReady,
    constraints,
    activeFacing,
    /** Camera being switched to while `status === "switching"`. */
    pendingFacing,
    canSwitch,
    error,
    notice,
    dismissNotice: () => setNotice(null),
    start,
    stop,
    switchCamera,
    handleError,
    handlePlaying,
  }
}
