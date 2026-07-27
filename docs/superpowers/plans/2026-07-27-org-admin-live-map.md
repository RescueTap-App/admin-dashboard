# Org-Admin Live Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/org/emergencies` map markers update per-user over a single Socket.IO connection, with a meters-based movement gate and accuracy circles — org-admin only.

**Architecture:** Extract pure geo/gate helpers; add a `useEmergencyLivePositions` hook that owns one socket and a `Record<userId, LivePosition>`; merge live coords over REST snapshots in `Emergencies`; update `MapView` to draw accuracy circles and fit bounds only when emergency IDs change.

**Tech Stack:** Next.js 15, React 19, Socket.IO client 4.8, `@react-google-maps/api`, Redux Toolkit Query (`useGetEmergenciesQuery`).

**Spec:** `docs/superpowers/specs/2026-07-27-org-admin-live-map-design.md`

## Global Constraints

- Org-admin only (`/org/emergencies`); do not touch super-admin.
- Do not change Socket.IO event names or payload shape (`emergency-{userId}`).
- Do not change mobile app GPS behavior.
- Socket URL remains `https://api.rescuetap.org`.
- Do not call `io()` in a component render body.
- Movement gate: accept if distance ≥ **3 m**, or first fix, or accuracy improved from &gt;50 m; skip if distance &lt; `accuracy / 2` when accuracy is present.
- Repo has **no** unit-test runner; verify pure helpers with a one-off Node assert script, then `npx tsc --noEmit`, then manual QA.

---

## File structure

| File | Responsibility |
|------|----------------|
| Create: `src/lib/live-location.ts` | `distanceMeters`, `shouldAcceptLiveUpdate`, shared types (`LivePosition`, `EmergencySocketPayload`) |
| Create: `src/hooks/use-emergency-live-positions.ts` | Single socket lifecycle + `livePositions` state keyed by `userId` |
| Create: `scripts/verify-live-location.mjs` | One-off assert script for geo/gate helpers (no Jest/Vitest) |
| Modify: `src/components/customs/org-dashboard/organizations/emergencies/index.tsx` | Remove render-body `io()`; merge live over API locations; drop `current-user` pin |
| Modify: `src/components/customs/org-dashboard/organizations/emergencies/manage/map-view/map.tsx` | `accuracy` on `LocationData`; `Circle`; bounds only on ID set change; InfoWindow uses marker lat/lng |
| Modify: `src/components/customs/org-dashboard/organizations/emergencies/manage/tabs/tab-content.tsx` | Extend `LocationData` with optional `accuracy` (keep in sync with map) |
| Modify: `docs/superpowers/specs/2026-07-27-product-backlog.md` | Mark 1.2–1.4 `in-progress` then `done` after QA |

---

### Task 1: Geo helpers + movement gate

**Files:**
- Create: `src/lib/live-location.ts`
- Create: `scripts/verify-live-location.mjs`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `distanceMeters(a: {latitude:number; longitude:number}, b: {latitude:number; longitude:number}): number`
  - `shouldAcceptLiveUpdate(prev: LivePosition | undefined, next: Omit<LivePosition, 'userId' | 'emergencyId'> & { accuracy?: number }): boolean`
  - Types: `LivePosition`, `EmergencySocketPayload`

- [ ] **Step 1: Create `src/lib/live-location.ts`**

```ts
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
```

- [ ] **Step 2: Create `scripts/verify-live-location.mjs`**

Duplicate the same formulas in plain JS (or compile via `npx tsx` if available). Prefer copying the logic into the script so it runs with `node` only:

```js
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
```

- [ ] **Step 3: Run the verify script**

Run: `node scripts/verify-live-location.mjs`  
Expected: `verify-live-location: ok`

- [ ] **Step 4: Commit**

```bash
git add src/lib/live-location.ts scripts/verify-live-location.mjs
git commit -m "$(cat <<'EOF'
feat(org-emergencies): add live location distance gate helpers

EOF
)"
```

---

### Task 2: `useEmergencyLivePositions` hook

**Files:**
- Create: `src/hooks/use-emergency-live-positions.ts`

**Interfaces:**
- Consumes: `LivePosition`, `EmergencySocketPayload`, `shouldAcceptLiveUpdate` from `@/lib/live-location`
- Produces: `useEmergencyLivePositions(emergencies: Array<{ _id: string; user: { _id: string }; isActive: boolean }> | undefined): Record<string, LivePosition>`

- [ ] **Step 1: Create the hook**

```ts
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
      // optional: quiet connect; avoid noisy logs in production
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: no errors from the new hook/file (fix any pre-existing project errors only if newly introduced).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-emergency-live-positions.ts
git commit -m "$(cat <<'EOF'
feat(org-emergencies): add per-user emergency live positions hook

EOF
)"
```

---

### Task 3: Wire `Emergencies` page — merge live over API

**Files:**
- Modify: `src/components/customs/org-dashboard/organizations/emergencies/index.tsx`

**Interfaces:**
- Consumes: `useEmergencyLivePositions`, `LivePosition`
- Produces: `locations[]` with one pin per active emergency; `accuracy` when live; no `current-user` synthetic pin

- [ ] **Step 1: Replace socket/`currentCoords` wiring**

Remove:
- `import { io } from "socket.io-client"`
- `SIGNIFICANT_CHANGE_THRESHOLD`
- `Payload` interface (use hook types)
- `const socket = io(...)`
- `currentCoords` state and the old `useEffect`
- The `current-user` entry in `locations`

Add:

```ts
import { useEmergencyLivePositions } from "@/hooks/use-emergency-live-positions"

// inside component:
const livePositions = useEmergencyLivePositions(
  Array.isArray(payload) ? payload : undefined,
)

const emergencyLocations: LocationData[] = useMemo(() => {
  if (!payload || !Array.isArray(payload)) return []

  return payload
    .filter((emergency: EmergencyData) => emergency.isActive)
    .map((emergency: EmergencyData) => {
      try {
        const live = livePositions[emergency.user._id]
        if (live) {
          return {
            id: emergency._id,
            latitude: live.latitude,
            longitude: live.longitude,
            accuracy: live.accuracy,
            title: `${emergency.user.firstName} ${emergency.user.lastName}`,
            description: emergency.message.substring(0, 100) + "...",
            type: "emergency" as const,
            timestamp: live.timestamp,
          }
        }

        const locationData = JSON.parse(emergency.location)
        return {
          id: emergency._id,
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          accuracy: locationData.coords?.accuracy,
          title: `${emergency.user.firstName} ${emergency.user.lastName}`,
          description: emergency.message.substring(0, 100) + "...",
          type: "emergency" as const,
          timestamp: locationData.timestamp,
        }
      } catch (error) {
        console.error("Error parsing location data:", error)
        return null
      }
    })
    .filter(Boolean) as LocationData[]
}, [payload, livePositions])
```

Update local `LocationData` in this file to include `accuracy?: number`.

Pass only `locations={emergencyLocations}` (no extra current-user pin).

Keep REST poll as-is for metadata (`pollingInterval: 3000`).

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`  
Expected: clean for touched files.

- [ ] **Step 3: Manual smoke (dev server)**

Run: `npm run dev` (if not already)  
Open `/org/emergencies?tab=map-view`  
Expected: page loads; Network shows one Socket.IO connection (not a new one every render).

- [ ] **Step 4: Commit**

```bash
git add src/components/customs/org-dashboard/organizations/emergencies/index.tsx
git commit -m "$(cat <<'EOF'
fix(org-emergencies): drive map pins from per-user live socket positions

EOF
)"
```

---

### Task 4: MapView — accuracy circle + stable bounds + live InfoWindow

**Files:**
- Modify: `src/components/customs/org-dashboard/organizations/emergencies/manage/map-view/map.tsx`
- Modify: `src/components/customs/org-dashboard/organizations/emergencies/manage/tabs/tab-content.tsx` (add `accuracy?: number` to `LocationData`)

**Interfaces:**
- Consumes: `locations` with optional `accuracy`
- Produces: markers that move without `fitBounds` on every tick; `Circle` when `accuracy > 0`

- [ ] **Step 1: Extend `LocationData` in both files**

```ts
interface LocationData {
  id?: string
  latitude: number
  longitude: number
  accuracy?: number
  title?: string
  description?: string
  type?: "emergency" | "user" | "responder"
  timestamp?: number
}
```

- [ ] **Step 2: Update `map.tsx` imports and bounds logic**

```ts
import React, { useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from "@react-google-maps/api"
```

Replace `onLoad` bounds-on-`locations` with:

```ts
const mapRef = useRef<google.maps.Map | null>(null)

const locationIdsKey = useMemo(
  () =>
    locations
      .map((l) => l.id)
      .filter(Boolean)
      .sort()
      .join("|"),
  [locations],
)

const fitToLocations = React.useCallback((map: google.maps.Map) => {
  const bounds = new window.google.maps.LatLngBounds()
  if (locations.length === 0) {
    bounds.extend(center)
  } else {
    locations.forEach((location) => {
      bounds.extend({ lat: location.latitude, lng: location.longitude })
    })
  }
  map.fitBounds(bounds)
}, [locations])

const onLoad = React.useCallback((map: google.maps.Map) => {
  mapRef.current = map
  fitToLocations(map)
}, [fitToLocations])

const onUnmount = React.useCallback(() => {
  mapRef.current = null
}, [])

// Re-fit only when the set of emergency IDs changes, not on every coordinate tick
useEffect(() => {
  if (!mapRef.current) return
  fitToLocations(mapRef.current)
  // intentionally depend on locationIdsKey, not full locations
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [locationIdsKey])
```

Note: `fitToLocations` still reads latest `locations` coords when IDs change — that is correct. Coordinate-only updates must **not** change `locationIdsKey`.

- [ ] **Step 3: Render `Circle` + fix InfoWindow position**

Inside the map, after markers:

```tsx
{locations.map((location, index) => {
  if (
    typeof location.accuracy !== "number" ||
    !Number.isFinite(location.accuracy) ||
    location.accuracy <= 0
  ) {
    return null
  }
  return (
    <Circle
      key={`accuracy-${location.id || index}`}
      center={{ lat: location.latitude, lng: location.longitude }}
      radius={location.accuracy}
      options={{
        fillColor: "#dc2626",
        fillOpacity: 0.12,
        strokeColor: "#dc2626",
        strokeOpacity: 0.4,
        strokeWeight: 1,
        clickable: false,
      }}
    />
  )
})}
```

For InfoWindow: prefer the matching entry from `locations` (live lat/lng) instead of parsing `selectedEmergency.location` only:

```ts
const selectedLocation = locations.find((l) => l.id === selectedEmergency._id)
const infoLat = selectedLocation?.latitude ?? JSON.parse(selectedEmergency.location).coords.latitude
const infoLng = selectedLocation?.longitude ?? JSON.parse(selectedEmergency.location).coords.longitude
```

Keep try/catch around parse fallback.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`  
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add \
  src/components/customs/org-dashboard/organizations/emergencies/manage/map-view/map.tsx \
  src/components/customs/org-dashboard/organizations/emergencies/manage/tabs/tab-content.tsx
git commit -m "$(cat <<'EOF'
feat(org-emergencies): show accuracy circles and stabilize map bounds

EOF
)"
```

---

### Task 5: Manual QA + backlog status

**Files:**
- Modify: `docs/superpowers/specs/2026-07-27-product-backlog.md`
- Modify: `docs/superpowers/specs/2026-07-27-org-admin-live-map-design.md` (status → implemented)

- [ ] **Step 1: Manual QA checklist**

With an active emergency and a moving device:

1. Open `/org/emergencies?tab=map-view`
2. Confirm **one** Socket.IO connection; remount/navigate away and back does not leave orphan listeners
3. Pin for that emergency moves (not a separate “Current User Location” pin)
4. Two active emergencies (if available) update independently
5. Accuracy circle visible when `accuracy` is present
6. Pan/zoom the map; live updates do **not** yank viewport
7. List tab still shows emergencies from REST

- [ ] **Step 2: Update backlog**

Set 1.2, 1.3, 1.4 status to `done` (or leave `in-progress` if QA blocked). Add note: “Implemented per `2026-07-27-org-admin-live-map-design.md`”.

- [ ] **Step 3: Update design status line**

Change design doc header status to: `Implemented on org-admin /org/emergencies`.

- [ ] **Step 4: Commit docs**

```bash
git add docs/superpowers/specs/2026-07-27-product-backlog.md docs/superpowers/specs/2026-07-27-org-admin-live-map-design.md
git commit -m "$(cat <<'EOF'
docs: mark org-admin live map backlog items done

EOF
)"
```

---

## Self-review

1. **Spec coverage:** Socket reuse, per-user live state, merge over API, meters gate, accuracy circle, bounds-on-ID-change, org-admin only — all have tasks.
2. **Placeholders:** None; code and commands are concrete.
3. **Type consistency:** `LivePosition`, `EmergencySocketPayload`, `LocationData.accuracy`, hook return `Record<string, LivePosition>` used consistently across tasks.
