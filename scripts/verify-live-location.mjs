import assert from 'node:assert/strict'

const MIN_MOVE_METERS = 3
const POOR_ACCURACY_METERS = 50

function distanceMeters(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180
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

function shouldAcceptLiveUpdate(prev, next) {
  if (!Number.isFinite(next.latitude) || !Number.isFinite(next.longitude)) return false
  if (!prev) return true
  const dist = distanceMeters(prev, next)
  if (
    typeof prev.accuracy === 'number' &&
    typeof next.accuracy === 'number' &&
    prev.accuracy > POOR_ACCURACY_METERS &&
    next.accuracy < prev.accuracy &&
    next.timestamp >= prev.timestamp
  ) {
    return true
  }
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

// ~1m east at equator ≈ 0.000009 deg
const base = { latitude: 0, longitude: 0, accuracy: 10, timestamp: 1, userId: 'u', emergencyId: 'e' }
assert.equal(shouldAcceptLiveUpdate(undefined, { latitude: 0, longitude: 0, timestamp: 1 }), true)
assert.equal(
  shouldAcceptLiveUpdate(base, { latitude: 0, longitude: 0.000009, accuracy: 10, timestamp: 2 }),
  false, // ~1m < 3m and < accuracy/2
)
assert.equal(
  shouldAcceptLiveUpdate(base, { latitude: 0, longitude: 0.00005, accuracy: 5, timestamp: 2 }),
  true, // ~5.5m >= 3m
)
assert.equal(
  shouldAcceptLiveUpdate(
    { ...base, accuracy: 80 },
    { latitude: 0, longitude: 0.00001, accuracy: 15, timestamp: 2 },
  ),
  true, // accuracy improved from poor
)
assert.equal(
  shouldAcceptLiveUpdate(base, { latitude: NaN, longitude: 1, timestamp: 2 }),
  false,
)

console.log('verify-live-location: ok')
