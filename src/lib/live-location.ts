/** ~3 m minimum move before accepting a new fix (see org-admin live map design). */
export const MIN_MOVE_METERS = 3
/** Always prefer a better fix when previous accuracy was worse than this. */
export const POOR_ACCURACY_METERS = 50

export type LivePosition = {
  userId: string
  emergencyId: string
  latitude: number
  longitude: number
  accuracy?: number
  heading?: number
  speed?: number
  timestamp: number
}

export type EmergencySocketPayload = {
  from: string
  message: {
    coords: {
      accuracy: number
      longitude: number
      altitude: number
      heading: number
      latitude: number
      altitudeAccuracy: number
      speed: number
    }
    mocked: boolean
    timestamp: number
  }
}

export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371000
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function shouldAcceptLiveUpdate(
  prev: LivePosition | undefined,
  next: {
    latitude: number
    longitude: number
    accuracy?: number
    timestamp: number
  },
): boolean {
  if (
    !Number.isFinite(next.latitude) ||
    !Number.isFinite(next.longitude)
  ) {
    return false
  }

  if (!prev) return true

  const dist = distanceMeters(prev, next)

  // Prefer a clearer fix when the previous one was poor.
  if (
    typeof prev.accuracy === 'number' &&
    typeof next.accuracy === 'number' &&
    prev.accuracy > POOR_ACCURACY_METERS &&
    next.accuracy < prev.accuracy &&
    next.timestamp >= prev.timestamp
  ) {
    return true
  }

  // Noise filter: ignore jitter smaller than half the reported accuracy.
  if (
    typeof next.accuracy === 'number' &&
    Number.isFinite(next.accuracy) &&
    next.accuracy > 0 &&
    dist < next.accuracy / 2
  ) {
    return false
  }

  return dist >= MIN_MOVE_METERS
}
