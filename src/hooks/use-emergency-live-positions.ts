"use client"

import { useEffect, useRef, useState } from "react"
import { io, type Socket } from "socket.io-client"
import {
  type EmergencySocketPayload,
  type LivePosition,
  shouldAcceptLiveUpdate,
} from "@/lib/live-location"

const SOCKET_URL = "https://api.rescuetap.org"

type EmergencyLike = {
  _id: string
  user: { _id: string }
  isActive: boolean
}

export function useEmergencyLivePositions(
  emergencies: EmergencyLike[] | undefined,
): Record<string, LivePosition> {
  const [livePositions, setLivePositions] = useState<Record<string, LivePosition>>({})
  const socketRef = useRef<Socket | null>(null)
  const emergencyByUserRef = useRef<Map<string, string>>(new Map())

  // Keep userId → emergencyId map current for the active set
  useEffect(() => {
    const map = new Map<string, string>()
    if (Array.isArray(emergencies)) {
      for (const e of emergencies) {
        if (e.isActive) map.set(e.user._id, e._id)
      }
    }
    emergencyByUserRef.current = map

    // Drop live state for users no longer active
    setLivePositions((prev) => {
      const next: Record<string, LivePosition> = {}
      for (const userId of map.keys()) {
        if (prev[userId]) next[userId] = prev[userId]
      }
      return next
    })
  }, [emergencies])

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: true })
    socketRef.current = socket

    const onConnect = () => {
      // Socket connected; listeners attach in the emergencies effect below.
    }
    socket.on("connect", onConnect)

    return () => {
      socket.off("connect", onConnect)
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    const activeUserIds = Array.isArray(emergencies)
      ? [
          ...new Set(
            emergencies.filter((e) => e.isActive).map((e) => e.user._id),
          ),
        ]
      : []

    const handlers = new Map<string, (data: EmergencySocketPayload) => void>()

    for (const userId of activeUserIds) {
      const event = `emergency-${userId}`
      const handler = (data: EmergencySocketPayload) => {
        const coords = data?.message?.coords
        const timestamp = data?.message?.timestamp
        if (!coords || !Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
          return
        }

        const emergencyId = emergencyByUserRef.current.get(userId)
        if (!emergencyId) return

        setLivePositions((prev) => {
          const candidate = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            heading: coords.heading,
            speed: coords.speed,
            timestamp: typeof timestamp === "number" ? timestamp : Date.now(),
          }
          if (!shouldAcceptLiveUpdate(prev[userId], candidate)) {
            return prev
          }
          return {
            ...prev,
            [userId]: {
              userId,
              emergencyId,
              ...candidate,
            },
          }
        })
      }
      handlers.set(event, handler)
      socket.on(event, handler)
    }

    return () => {
      for (const [event, handler] of handlers) {
        socket.off(event, handler)
      }
    }
  }, [emergencies])

  return livePositions
}
