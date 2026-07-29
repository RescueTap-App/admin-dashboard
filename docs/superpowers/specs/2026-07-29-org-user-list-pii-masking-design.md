# Org User List PII Masking — Design

> **Status:** Implemented on org-admin `/org/users`  
> **Date:** 2026-07-29  
> **Surface:** Org admin only (`/org/users`)  
> **Backlog:** 5.6 — Hide or blur user details in user list for organizations

## Problem

The organization users list (`UsersListTable`) shows full PII in plain text: first name, last name, email, phone number, and address. Organization admins should not see complete personal details in this list.

## Goal

Always display partially masked values (a few characters visible, rest as asterisks) for sensitive columns on the org users list. Profile images and registration/update dates stay fully visible. No reveal / unmask control.

## Scope

### In scope

- Org admin users list: `src/components/customs/org-dashboard/organizations/org-users/users-list/table.tsx`
- Shared pure mask helpers (recommended approach #1)
- Fields: first name, last name, email, phone number, address

### Out of scope

- Super-admin users list
- Profile image changes
- Reveal / hover-to-unmask UI
- Backend API redaction (data still arrives in full to the client; UI masks for display)
- Changing search/filter behavior (global filter may still match against raw row data in memory)

## Masking rules

| Field | Rule | Example |
|-------|------|---------|
| First name / last name | Keep first **2** characters; replace remaining with `*` (same length as hidden part, capped at 5 `*`) | `Jo***` for `John` |
| Email | Local part: keep first **2** chars, mask rest. Domain: keep first char of each label, mask rest; keep TLD | `jo***@g***.com` for `john@gmail.com` |
| Phone | Keep last **4** digits visible; mask other digit characters; preserve leading `+` and non-digit separators where practical | `+234******8901` |
| Address | Keep first **4** characters; mask the rest (cap at 8 `*`) | `12 M********` |
| Empty / missing | Show empty string or existing fallback (`—` if already used); do not crash |

Helpers must be pure, side-effect free, and safe for `null` / `undefined` / empty string.

## Architecture

```
OrgUsersTypes (API) → UsersListTable cells → mask*() helpers → displayed string
```

1. Create `src/lib/mask-pii.ts` with:
   - `maskName(value: string | null | undefined): string`
   - `maskEmail(value: string | null | undefined): string`
   - `maskPhone(value: string | null | undefined): string`
   - `maskAddress(value: string | null | undefined): string`
2. In `table.tsx` cells for `firstName`, `lastName`, `email`, `phoneNumber`, `address`, render the masked string instead of the raw value.
3. Leave `profileImage`, `createdAt`, `updatedAt` unchanged.

## Approach choice

**Shared mask helpers (approach 1)** — chosen over CSS blur (weaker; copyable) and backend redaction (out of scope for this pass).

## Privacy note

This is **display masking only**. Full values still exist in client memory and network responses. True redaction requires API changes later.

## Success criteria

- Org `/org/users` list never shows full name, email, phone, or address in those columns.
- A few leading (or trailing for phone) characters remain readable.
- Profile images still render from the user’s URL / default avatar.
- Mask helpers handle empty values without throwing.
- Super-admin user list behavior unchanged.

## Testing

Repo has no unit-test runner; verify helpers with a small Node assert script (same pattern as `scripts/verify-live-location.mjs`), then manual check of `/org/users`.

## Files

| File | Change |
|------|--------|
| Create: `src/lib/mask-pii.ts` | Mask helpers |
| Create: `scripts/verify-mask-pii.mjs` | Assert script for helpers |
| Modify: `.../org-users/users-list/table.tsx` | Use helpers in cells |
| Modify: backlog `2026-07-27-product-backlog.md` | Mark 5.6 done after ship |
