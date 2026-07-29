# Restrict Normal Org Users from Admin — Design

> **Status:** Implemented  
> **Date:** 2026-07-29  
> **Surface:** Auth + middleware (super-admin `/dashboard`, org-admin `/org`)  
> **Backlog:** 5.5 — Restrict normal organization users from having access to the admin

## Goal

Only `role === "admin"` and `role === "organization"` may use this admin dashboard. Normal users (including org members with `role === "user"`) who log in stay on the login page with an error toast — no session for this app.

## Behavior

| Role | Outcome |
|------|---------|
| `admin` | Login OK → `/dashboard/...` |
| `organization` | Login OK → `/org` |
| `user`, `driver`, other | No cookie/session; toast; remain on login |

Unsafe `?redirect=` ignored unless the user’s role is allowed for that path.

## Changes

1. `use-auth.ts` — reject non-admin/non-organization after successful API login (clear any partial state, toast).
2. `middleware.ts` — gate all `/dashboard` to `admin`; `/org` to `organization`.
3. `use-redirect.ts` — same allowlist; don’t send `user` into admin routes.

## Out of scope

- Backend 403 changes (should still be enforced server-side separately)
- Separating org vs normal users list (paused)
