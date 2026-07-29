# RescueTap Admin — Product Backlog

> **Status:** Inventory only — no implementation yet  
> **Date:** 2026-07-27  
> **Format:** Single backlog grouped by workstream  
> **Surfaces:** `super-admin` · `org-admin` · `app` · `shared`

Suggested build order (rough): **7 → 5 → 4 → 3 → 2 → 1 → 6 → 8**

| Status | Meaning |
|--------|---------|
| `todo` | Not started |
| `in-progress` | Actively being worked |
| `blocked` | Waiting on dependency / decision |
| `done` | Shipped |

---

## Workstream 1 — Maps & live location

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 1.1 | Location-based reporting via map and notifications | shared | todo | Report incidents/locations on map; notify relevant admins/users |
| 1.2 | More precise location on the map | org-admin | done | Implemented per `2026-07-27-org-admin-live-map-design.md` (meters gate + accuracy circle) |
| 1.3 | Real-time tracking on the admin map | org-admin | done | Per-user live socket positions on `/org/emergencies` |
| 1.4 | Reduce 4–5s lag before location appears on the map | org-admin | done | Single socket client; live overlay prefers socket over 3s poll |
| 1.5 | Link on admin dashboard to open Google Maps | super-admin, org-admin | todo | Deep-link from admin map/pin to Google Maps |
| 1.6 | Snapchat-like map on the app and the admin | app, super-admin, org-admin | todo | Friend/bitmoji-style map UX across surfaces |

---

## Workstream 2 — Check-in / visitors

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 2.1 | Location-based check-in system | app, org-admin | todo | Check in against a place / geofence |
| 2.2 | Flag for visitors late vs check-in time | org-admin, super-admin | todo | Visual/status flag when visitor arrives after expected time |
| 2.3 | Activity log: export visitors as CSV with month filter | org-admin | done | Month filter + full-month CSV on `/org/visitors`; swappable `VisitorMonthBasis` (default `checkedInAt`); see `2026-07-29-visitors-month-csv-export-design.md` |

---

## Workstream 3 — Analytics

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 3.1 | Super-admin dashboard analytics from emergencies + live location sharing | super-admin | todo | Aggregate emergency and live-location metrics |
| 3.2 | Analytics dashboard | super-admin, org-admin | todo | Broader analytics surface (may overlap 3.1 / 3.3) |
| 3.3 | Track slots used/left, slot requests, and emergency tracking | super-admin, org-admin | todo | Slot utilization + emergency counts on both dashboards |

---

## Workstream 4 — Subscriptions & billing

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 4.1 | Specify number of months each org can be subscribed for (admin) | super-admin | todo | Admin-configurable subscription duration per org |
| 4.2 | Bank transfer alternative, then send to email | shared | todo | Offline payment path; confirmation/details emailed |
| 4.3 | Track users logging in from an organization subscription | super-admin, org-admin | todo | Attribute app logins to org subscription |
| 4.4 | Setting user limit for each organization | super-admin | todo | Cap seats/slots per org (ties to 3.3 / 5.2) |

---

## Workstream 5 — User & organization management

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 5.1 | Delete users from organization admin | org-admin | todo | Org admins can remove users from their org |
| 5.2 | User limit per organization | super-admin, org-admin | todo | Enforce limit from 4.4 when inviting/adding users |
| 5.3 | Separate org users from normal users on the admin | super-admin | todo | Distinct lists/filters/views |
| 5.4 | Upgrade a normal user into an organization user | super-admin | todo | Promote / attach user to an org |
| 5.5 | Restrict normal organization users from admin access | org-admin, shared | done | Login toast + middleware: only `admin` / `organization` roles; see `2026-07-29-restrict-org-member-admin-access-design.md` |
| 5.6 | Hide or blur user details in user list for organizations | org-admin | done | Partial asterisk mask on org `/org/users` (name, email, phone, address); see `2026-07-29-org-user-list-pii-masking-design.md` |
| 5.7 | Edit organization details | super-admin, org-admin | todo | Update org profile/settings |
| 5.8 | Show which users login to the app (esp. org users) in super-admin user list | super-admin | todo | Login activity columns/data on user list (ties to 4.3) |

---

## Workstream 6 — Media

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 6.1 | Page to view voice notes on admin dashboard | super-admin, org-admin | todo | Browse/play voice notes from emergencies or reports |

---

## Workstream 7 — Onboarding

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 7.1 | Bulk onboarding error | org-admin | todo | Bug fix for bulk registry / invite flow |

---

## Workstream 8 — Admin UX

| ID | Task | Area | Status | Notes |
|----|------|------|--------|-------|
| 8.1 | Admin redesign | super-admin, org-admin | todo | Visual/IA refresh; prefer after features stabilize |

---

## Cross-references (related items)

| Theme | Related IDs |
|-------|-------------|
| Slots / seat limits | 3.3, 4.4, 5.2 |
| Login / subscription attribution | 4.3, 5.8 |
| Map precision + latency + realtime | 1.2, 1.3, 1.4 |
| Visitor check-in + lateness + export | 2.1, 2.2, 2.3 |
| Analytics overlap | 3.1, 3.2, 3.3 |

---

## Out of scope for this document

- Detailed requirements, API contracts, UI mockups, or implementation plans  
- Priority ranking within a workstream (to be set when a workstream is picked up)  
- App-only vs admin-only ownership splits beyond the `Area` column  

When ready to build a workstream, deepen it into a design spec (`docs/superpowers/specs/`) then an implementation plan (`docs/superpowers/plans/`).
