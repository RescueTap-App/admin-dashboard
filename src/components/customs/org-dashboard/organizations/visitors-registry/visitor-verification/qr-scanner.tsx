"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { preloadQrDecoder } from "@/lib/qr-decoder"
import {
    QrCode,
    Camera,
    CameraOff,
    CircleCheck,
    SwitchCamera,
    Maximize2,
    Minimize2,
    RefreshCw,
    TriangleAlert,
    X,
} from "lucide-react"
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useVerifyCodeMutation } from "@/redux/features/visitors-api";
import { useScannerCamera, type FacingMode } from "./use-scanner-camera"

interface VisitorData {
    _id: string
    tenantId: {
        _id: string
        firstName: string
        lastName: string
        phoneNumber: string
    }
    name: string
    phone: string
    vehicleNumber: string
    purpose: string
    startTime: string
    endTime: string
    entryCode: string
    checkedInAt: string
    status: 'pending' | 'expired' | 'checked_out' | 'checked_in' | 'canceled'
    photoUrl: string | null
    createdAt: string
    updatedAt: string
    __v: number
}

interface QRScannerProps {
    onVisitorScanned: (visitor: VisitorData) => void
    onVerificationComplete: (result: { success: boolean; message: string; visitor?: VisitorData }) => void
    isVerifying: boolean
    tenantId: string
    disabled?: boolean
    /** Ignore scans while true (e.g. the result dialog is open). The camera keeps running. */
    paused?: boolean
}

/** How often the library reports a code that stays in view. */
const SCAN_REPEAT_MS = 500
/**
 * After a code is handled (or the result dialog closes), the same code is
 * ignored for this long, so a QR still held up doesn't instantly re-verify
 * (which would e.g. check someone out right after checking them in).
 */
const SAME_CODE_COOLDOWN_MS = 3000

const cameraName = (facing: FacingMode) => (facing === "user" ? "front" : "back")

/** Pull the entry code out of a scan: plain text, or JSON with name/code/entryCode/id. */
function extractEntryCode(codes: IDetectedBarcode[]): string | null {
    const raw = codes[0]?.rawValue?.trim()
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        const fromJson = parsed?.name || parsed?.code || parsed?.entryCode || parsed?.id
        if (fromJson != null && String(fromJson).trim()) return String(fromJson).trim()
    } catch {
        // Not JSON — the raw value is the code.
    }
    return raw
}

// ---- Scan feedback (beep + vibration) ------------------------------------

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    audioCtx ??= new Ctx()
    return audioCtx
}

/** Browsers only allow audio after a user gesture — call this from a click. */
function unlockScanSound() {
    try {
        void getAudioContext()?.resume()
    } catch {
        // Sound is a nice-to-have.
    }
}

function playScanFeedback() {
    try {
        navigator.vibrate?.(80)
    } catch {
        // Not supported (e.g. iOS).
    }
    try {
        const ctx = getAudioContext()
        if (!ctx || ctx.state !== "running") return
        const t = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = 1046
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
        osc.connect(gain).connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.16)
    } catch {
        // Sound is a nice-to-have.
    }
}

// ---- Fullscreen -------------------------------------------------------------

/**
 * Expands the camera viewport to cover the screen (a fixed overlay), and where
 * supported also puts the whole page into browser fullscreen to hide the
 * browser UI. The *page* goes fullscreen, not the viewport element, so the
 * verification result dialog (rendered at the page root) still shows on top.
 */
function useScannerFullscreen() {
    const [expanded, setExpanded] = useState(false)
    const ownsNativeRef = useRef(false)

    const exit = useCallback(() => {
        setExpanded(false)
        if (ownsNativeRef.current && document.fullscreenElement) {
            void document.exitFullscreen().catch(() => {})
        }
        ownsNativeRef.current = false
    }, [])

    const enter = useCallback(() => {
        setExpanded(true)
        const root = document.documentElement
        if (root.requestFullscreen && document.fullscreenEnabled && !document.fullscreenElement) {
            root.requestFullscreen({ navigationUI: "hide" })
                .then(() => { ownsNativeRef.current = true })
                .catch(() => { /* overlay alone is fine (e.g. iPhone Safari) */ })
        }
    }, [])

    // Browser fullscreen ended by the user (Esc, back gesture) → collapse too.
    useEffect(() => {
        const onChange = () => {
            if (!document.fullscreenElement && ownsNativeRef.current) {
                ownsNativeRef.current = false
                setExpanded(false)
            }
        }
        document.addEventListener("fullscreenchange", onChange)
        return () => document.removeEventListener("fullscreenchange", onChange)
    }, [])

    // While expanded: lock page scroll; Escape collapses (when not native).
    useEffect(() => {
        if (!expanded) return
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !document.querySelector("[role=dialog]")) exit()
        }
        window.addEventListener("keydown", onKey)
        return () => {
            document.body.style.overflow = previous
            window.removeEventListener("keydown", onKey)
        }
    }, [expanded, exit])

    // Leave browser fullscreen if the scanner unmounts while expanded.
    useEffect(() => () => {
        if (ownsNativeRef.current && document.fullscreenElement) {
            void document.exitFullscreen().catch(() => {})
        }
    }, [])

    return { expanded, toggle: expanded ? exit : enter, exit }
}

// ---- Component --------------------------------------------------------------

function QRScanner({ onVisitorScanned, onVerificationComplete, isVerifying, tenantId, disabled = false, paused = false }: QRScannerProps) {
    const [isQrVerifying, setIsQrVerifying] = useState(false)
    const [verifyCode] = useVerifyCodeMutation()
    const camera = useScannerCamera("user")
    const fullscreen = useScannerFullscreen()
    const { notice, dismissNotice } = camera

    /** A verification request is in flight (ref: updated synchronously). */
    const inFlightRef = useRef(false)
    /** Last handled code and until when it's ignored. */
    const recentRef = useRef<{ code: string; until: number }>({ code: "", until: 0 })

    // Latest props/state for the (stable) scan handler.
    const latest = useRef({ isVerifying, disabled, tenantId, paused, status: camera.status, onVerificationComplete, onVisitorScanned })
    latest.current = { isVerifying, disabled, tenantId, paused, status: camera.status, onVerificationComplete, onVisitorScanned }

    // Have the decoder ready before the first QR is shown.
    useEffect(() => {
        void preloadQrDecoder()
    }, [])

    // Non-fatal camera notices fade out on their own.
    useEffect(() => {
        if (!notice) return
        const id = setTimeout(dismissNotice, 5000)
        return () => clearTimeout(id)
    }, [notice, dismissNotice])

    // When the result dialog closes, give the person a moment to lower the QR.
    useEffect(() => {
        if (paused) return
        const recent = recentRef.current
        if (recent.code) {
            recent.until = Math.max(recent.until, Date.now() + SAME_CODE_COOLDOWN_MS)
        }
    }, [paused])

    const handleScan = useCallback(async (codes: IDetectedBarcode[]) => {
        const { isVerifying, disabled, tenantId, paused, status } = latest.current
        if (inFlightRef.current || paused || isVerifying || disabled || !tenantId || status !== "live") return

        const entryCode = extractEntryCode(codes)
        if (!entryCode) return

        const recent = recentRef.current
        if (recent.code === entryCode && Date.now() < recent.until) return

        // Lock immediately — the library keeps reporting while the QR is in view.
        inFlightRef.current = true
        recentRef.current = { code: entryCode, until: Number.POSITIVE_INFINITY }
        setIsQrVerifying(true)
        playScanFeedback()

        try {
            const result = await verifyCode({
                data: { code: entryCode, tenantId }
            }).unwrap()

            latest.current.onVerificationComplete({
                success: true,
                message: result.message || "Visitor verified successfully!",
                visitor: result.visitor || result
            })
            latest.current.onVisitorScanned(result.visitor || result)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Verification failed:', error)
            latest.current.onVerificationComplete({
                success: false,
                message: error?.data?.message || "Invalid or expired code",
                visitor: undefined
            })
        } finally {
            inFlightRef.current = false
            recentRef.current = { code: entryCode, until: Date.now() + SAME_CODE_COOLDOWN_MS }
            setIsQrVerifying(false)
        }
    }, [verifyCode])

    const startScanning = () => {
        unlockScanSound()
        recentRef.current = { code: "", until: 0 }
        camera.start()
    }

    const stopScanning = () => {
        fullscreen.exit()
        camera.stop()
        recentRef.current = { code: "", until: 0 }
    }

    const { status } = camera
    const isStarting = status === "starting"
    const isSwitching = status === "switching"
    const isLive = status === "live"
    const showViewport = camera.isActive || status === "error"
    const busyFacing = camera.pendingFacing ?? camera.activeFacing
    const expanded = fullscreen.expanded

    return (
        <div className="space-y-6">
            {/* QR Code Icon and Title */}
            <div className="flex items-center gap-4">
                <div className="sm:p-3 p-2 bg-gray-100 rounded-lg">
                    <QrCode className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 font-nunito">Scan Visitor QR</h2>
                    <p className="text-gray-600 font-nunito">Scan a visitor or personnel QR code with the front camera</p>
                </div>
            </div>

            {/* Camera Section */}
            <div className="space-y-4">
                {!showViewport ? (
                    <div className="text-center space-y-4">
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                                <p className="text-gray-500">Camera not active</p>
                            </div>
                        </div>

                        <Button
                            onClick={startScanning}
                            disabled={disabled || isVerifying || isQrVerifying}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 disabled:opacity-50"
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            Open Camera
                        </Button>

                        <p className="text-sm text-gray-500">
                            {disabled
                                ? "Select an organization before opening the camera."
                                : "The front camera opens first. On a phone, switch between the front and back cameras while scanning."}
                        </p>

                    </div>
                ) : (
                    <div className="space-y-4">
                        <div
                            className={cn(
                                "relative overflow-hidden bg-black [perspective:1200px]",
                                expanded
                                    ? "fixed inset-0 z-40 h-[100dvh] w-screen rounded-none"
                                    : "w-full h-64 sm:h-80 rounded-lg",
                            )}
                        >
                            {status === "error" ? (
                                <div className="w-full h-full flex items-center justify-center p-6 animate-in fade-in duration-300">
                                    <div className="max-w-sm text-center space-y-3">
                                        <CameraOff className="w-12 h-12 text-red-400 mx-auto" />
                                        <p className="text-white font-semibold">Camera failed to load</p>
                                        <p className="text-sm text-gray-300">{camera.error}</p>
                                        <div className="flex justify-center gap-2 pt-1">
                                            <Button
                                                onClick={startScanning}
                                                size="sm"
                                                className="bg-white text-gray-900 hover:bg-gray-200"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Try again
                                            </Button>
                                            <Button
                                                onClick={stopScanning}
                                                size="sm"
                                                variant="ghost"
                                                className="text-gray-200 hover:bg-white/10 hover:text-white"
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Camera feed — flips out while switching, back in when the new camera is live */}
                                    <div
                                        ref={camera.containerRef}
                                        onPlayingCapture={camera.handlePlaying}
                                        className={cn(
                                            "absolute inset-0 transition-all duration-300 ease-in-out",
                                            "[&_video]:!object-cover",
                                            isLive
                                                ? "opacity-100 [transform:rotateY(0deg)_scale(1)] blur-0"
                                                : isSwitching
                                                    ? "opacity-0 [transform:rotateY(90deg)_scale(0.92)] blur-sm"
                                                    : "opacity-0",
                                        )}
                                    >
                                        {camera.scannerReady && (
                                            <Scanner
                                                key={camera.scannerKey}
                                                constraints={camera.constraints}
                                                onScan={handleScan}
                                                onError={camera.handleError}
                                                // Report a code every SCAN_REPEAT_MS while in view (we de-dupe),
                                                // so the same QR can be scanned again, e.g. to check out.
                                                allowMultiple
                                                scanDelay={SCAN_REPEAT_MS}
                                                // We play our own beep once per accepted scan.
                                                sound={false}
                                                styles={{
                                                    container: { width: "100%", height: "100%" },
                                                    video: { width: "100%", height: "100%", objectFit: "cover" },
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Scanning frame — turns green when a code is caught */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                                            isLive ? "opacity-100" : "opacity-0",
                                        )}
                                    >
                                        <div className={cn(
                                            "border-2 rounded-lg relative transition-all duration-300",
                                            expanded ? "w-64 h-64 sm:w-80 sm:h-80" : "w-48 h-48",
                                            isQrVerifying ? "border-green-500 scale-105" : "border-red-500",
                                        )}>
                                            {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((pos) => (
                                                <div
                                                    key={pos}
                                                    className={cn("absolute w-6 h-6", pos, isQrVerifying ? "border-green-500" : "border-red-500")}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Code caught → instant confirmation while the server verifies */}
                                    {isQrVerifying && (
                                        <div
                                            role="status"
                                            aria-live="assertive"
                                            className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150"
                                        >
                                            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 px-8 py-6 text-center shadow-xl animate-in zoom-in-90 duration-200">
                                                <CircleCheck className="w-12 h-12 text-green-600 animate-in zoom-in-50 duration-300" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">QR code detected</p>
                                                    <p className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600">
                                                        <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                                        Verifying…
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Starting / switching state */}
                                    {(isStarting || isSwitching) && (
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white animate-in fade-in duration-200"
                                        >
                                            {isSwitching ? (
                                                <div className="rounded-full bg-white/10 p-4 backdrop-blur">
                                                    <SwitchCamera className="w-8 h-8 animate-[spin_1s_ease-in-out_infinite]" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            )}
                                            <p className="text-sm font-medium">
                                                {isSwitching
                                                    ? `Switching to ${cameraName(busyFacing)} camera…`
                                                    : "Starting camera…"}
                                            </p>
                                            {isStarting && (
                                                <p className="text-xs text-gray-300 px-6 text-center">
                                                    If your browser asks, allow camera access.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Top bar: active camera + close fullscreen */}
                                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                                        {isLive ? (
                                            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur animate-in fade-in duration-300">
                                                {camera.activeFacing === "user" ? "Front camera" : "Back camera"}
                                            </span>
                                        ) : <span />}
                                        {expanded && (
                                            <button
                                                type="button"
                                                onClick={fullscreen.exit}
                                                aria-label="Exit full screen"
                                                className="pointer-events-auto rounded-full bg-black/60 p-2 text-white backdrop-blur transition hover:bg-black/80"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Non-fatal notice (e.g. a switch that was rolled back) */}
                                    {notice && (
                                        <div className="absolute inset-x-3 top-14 flex justify-center animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex max-w-md items-start gap-2 rounded-md bg-amber-500/95 px-3 py-2 text-xs font-medium text-amber-950 shadow">
                                                <TriangleAlert className="mt-0.5 w-4 h-4 shrink-0" />
                                                <span className="flex-1">{notice}</span>
                                                <button type="button" onClick={dismissNotice} aria-label="Dismiss">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bottom controls */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 pb-[env(safe-area-inset-bottom)]">
                                        {camera.canSwitch ? (
                                            <button
                                                type="button"
                                                onClick={camera.switchCamera}
                                                disabled={!isLive || isQrVerifying}
                                                aria-label={`Switch to ${cameraName(camera.activeFacing === "user" ? "environment" : "user")} camera`}
                                                className="rounded-full bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-40"
                                            >
                                                <SwitchCamera className={cn("w-5 h-5 transition-transform duration-300", isSwitching && "rotate-180")} />
                                            </button>
                                        ) : <span />}
                                        <div className="flex items-center gap-2">
                                            {expanded && (
                                                <button
                                                    type="button"
                                                    onClick={stopScanning}
                                                    className="rounded-full bg-red-600/90 px-4 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-red-600"
                                                >
                                                    Stop camera
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={fullscreen.toggle}
                                                aria-label={expanded ? "Exit full screen" : "Full screen"}
                                                title={expanded ? "Exit full screen" : "Full screen"}
                                                className="rounded-full bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/80"
                                            >
                                                {expanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-center gap-2 flex-wrap">
                            <Button
                                onClick={stopScanning}
                                variant="outline"
                                className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                                <CameraOff className="w-4 h-4 mr-2" />
                                Stop Camera
                            </Button>
                            {camera.canSwitch && (
                                <Button
                                    onClick={camera.switchCamera}
                                    variant="outline"
                                    disabled={!isLive || isQrVerifying}
                                    className="border-gray-600 text-gray-700 hover:bg-gray-50"
                                >
                                    <SwitchCamera className="w-4 h-4 mr-2" />
                                    {isSwitching
                                        ? "Switching..."
                                        : camera.activeFacing === "user" ? "Use back camera" : "Use front camera"}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QRScanner
