# Org-Admin Live Map — Accuracy & Realtime Design

> **Status:** Approved for documentation; implementation not started  
> **Date:** 2026-07-27  
> **Surface:** Org admin only (`/org/emergencies`)  
> **Backlog:** 1.2, 1.3, 1.4 (and supports 1.1 map portion later)

## Problem

Org-admin emergency map feels imprecise and delayed because:

1. Socket client is created on every render (`io(...)` in the component body), causing reconnect churn (likely contributor to multi-second lag).
2. All live socket updates collapse into a single `currentCoords` pin, not per emergency user.
3. Active emergency markers are driven by polled API `location` JSON (every 3s), while socket updates only feed a separate “current user” pin.
4. Updates are dropped unless lat/lng change ≥ `0.0001`° (~11 m), so small movement never appears.
5. Incoming `accuracy` is unused; admins cannot see location confidence.
6. Map `fitBounds` on load can re-center aggressively when location props change.

## Goal

Make `/org/emergencies` map pins update faster and feel more precise **without** changing the mobile app GPS pipeline or the Socket.IO event contract.

## Scope

### In scope

- Single shared Socket.IO client: create once, disconnect on unmount
- Per-emergency-user live positions keyed by `user._id`
- Drive active emergency markers from socket updates when available; keep API poll for list/metadata (names, contacts, message, `isActive`)
- Replace the ~11 m degree threshold with a smaller distance gate (meters), optionally accuracy-aware
- Accuracy circle on live/selected pin when `coords.accuracy` is present
- Marker updates in place without re-fitting the full map on every small update

### Out of scope

- Super-admin map (no reuse in this pass)
- Mobile app GPS settings / send rate
- Snapchat-style map UX
- New backend socket events or payload shape
- Google Maps deep-link (backlog 1.5)
- Location-based reporting notifications (backlog 1.1 full feature)

## Current architecture

```
Mobile app → api.rescuetap.org (Socket.IO) → org-admin Emergencies page
                                              ├─ socket: emergency-{userId}
                                              └─ REST poll: useGetEmergenciesQuery (3s)

MapView ← locations[] + emergencies[]
```

**Event shape (unchanged):**

```ts
{
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
```

## Target design

### Data flow

1. REST poll loads active emergencies (metadata + initial `location` snapshot).
2. For each active emergency `user._id`, subscribe to `emergency-{userId}`.
3. Maintain `livePositions: Record<userId, LivePosition>` from socket events.
4. When building map `locations[]`:
   - Prefer `livePositions[userId]` over parsed API `location` for that emergency.
   - Fall back to API snapshot until the first socket event arrives.
5. List view / dialogs continue to use emergency payload from REST; map position is live-overlaid.

### LivePosition model

```ts
type LivePosition = {
  userId: string
  emergencyId: string
  latitude: number
  longitude: number
  accuracy?: number
  heading?: number
  speed?: number
  timestamp: number
}
```

### Socket lifecycle

- Create socket once inside `useEffect` (or a small hook `useEmergencySocket`).
- URL: existing `https://api.rescuetap.org`.
- On `payload` change: diff user IDs; `socket.on` for new users, `socket.off` for removed/inactive.
- On unmount: remove all listeners and `socket.disconnect()`.
- Do **not** call `io()` in the component render body.

### Movement gate

- Replace `SIGNIFICANT_CHANGE_THRESHOLD = 0.0001` with a **meters** distance check (haversine or equirectangular approximation).
- Default gate: update if distance ≥ **3 m** OR if previous position has no timestamp yet.
- Optional: if `accuracy` is present and distance &lt; `accuracy / 2`, skip update (noise filter). Document chosen constants in code comments.
- Always accept update if `timestamp` is newer and previous accuracy was poor (&gt; 50 m) while new accuracy is better.

### Map behavior (`map.tsx`)

- Markers: one per emergency location; position from merged live/API data.
- Accuracy: `google.maps.Circle` (or equivalent) around live pin when `accuracy` is finite and &gt; 0.
- Bounds: `fitBounds` only on initial load or when the set of emergency IDs changes — **not** on every coordinate tick.
- Optional later (not required for v1): short marker interpolation between points.

### Error / edge cases

- Invalid/missing coords in socket payload → ignore event, keep last good position.
- Parse failure on API `location` → skip that emergency marker, log once.
- Socket disconnect → keep last live positions; REST snapshot remains fallback; reconnect via Socket.IO defaults.
- Multiple emergencies for same user → key live state by `userId`; latest event updates that user’s pin (attach to each matching emergency marker).

## Files to change

| File | Responsibility |
|------|----------------|
| `src/components/customs/org-dashboard/organizations/emergencies/index.tsx` | Socket lifecycle, `livePositions` state, merge into `locations[]` |
| `src/components/customs/org-dashboard/organizations/emergencies/manage/map-view/map.tsx` | Accuracy circle, bounds-on-ID-change only |
| Optional: `src/hooks/use-emergency-socket.ts` (or similar) | Extract socket + live state if `index.tsx` grows too large |

## Success criteria

- Moving user updates the **correct** emergency pin within ~1s of a socket event under normal network.
- Multiple active emergencies each show their own live position.
- Movements smaller than ~11 m can appear (subject to the new ~3 m / accuracy gate).
- No reconnect churn from creating a new `io()` client every render.
- Map does not constantly re-fit bounds while a pin moves.

## Testing plan (manual)

1. Open `/org/emergencies` map with at least one active emergency.
2. Confirm socket connects once (Network / console); refresh should not stack duplicate listeners.
3. Move the reporting device; pin should track that emergency, not a generic “Current User Location” only.
4. Open two active emergencies (if available); both pins update independently.
5. Verify accuracy circle appears when payload includes `accuracy`.
6. Pan/zoom the map; subsequent live updates should not yank the viewport.

## Non-goals reminder

Super-admin is explicitly excluded. A future super-admin map would be a separate design, not a copy-paste of this pass.
