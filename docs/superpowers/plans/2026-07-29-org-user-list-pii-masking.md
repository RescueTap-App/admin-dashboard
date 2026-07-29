# Org User List PII Masking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Partially mask name, email, phone, and address in the org admin users list using shared asterisk helpers; leave profile images unchanged.

**Architecture:** Pure helpers in `src/lib/mask-pii.ts`; org `UsersListTable` cells call them for display only. No reveal UI; no API changes.

**Tech Stack:** TypeScript, React, TanStack Table, Node assert script (no Jest/Vitest).

**Spec:** `docs/superpowers/specs/2026-07-29-org-user-list-pii-masking-design.md`

## Global Constraints

- Org-admin `/org/users` only; do not change super-admin users list.
- Always masked; no reveal control.
- Profile image and date columns unchanged.
- Display masking only; raw data may remain in client memory.
- Empty/null-safe helpers.
- Verify with `scripts/verify-mask-pii.mjs` then `npx tsc --noEmit`.

---

## File structure

| File | Responsibility |
|------|----------------|
| Create: `src/lib/mask-pii.ts` | `maskName`, `maskEmail`, `maskPhone`, `maskAddress` |
| Create: `scripts/verify-mask-pii.mjs` | Assert script mirroring helper rules |
| Modify: `src/components/customs/org-dashboard/organizations/org-users/users-list/table.tsx` | Render masked values in cells |
| Modify: backlog + design status | Mark 5.6 done |

---

### Task 1: Mask helpers + verify script

**Files:**
- Create: `src/lib/mask-pii.ts`
- Create: `scripts/verify-mask-pii.mjs`

**Interfaces:**
- Produces: `maskName`, `maskEmail`, `maskPhone`, `maskAddress` — each `(value: string | null | undefined) => string`

- [ ] **Step 1: Write `scripts/verify-mask-pii.mjs` with expected behavior**

Include cases: empty → `""`; `John` → `Jo**`; `john@gmail.com` → `jo**@g****.com` (or per exact helper); phone last 4 visible; address first 4 + stars.

- [ ] **Step 2: Implement `src/lib/mask-pii.ts` to match the script**

Rules from spec:
- Name: keep 2, mask rest (max 5 `*`)
- Email: local keep 2 + mask; domain labels keep 1 + mask; keep TLD
- Phone: mask digit chars except last 4; keep `+` and separators
- Address: keep 4, mask rest (max 8 `*`)

- [ ] **Step 3: Run** `node scripts/verify-mask-pii.mjs` → `ok`

- [ ] **Step 4: Commit**

```bash
git add src/lib/mask-pii.ts scripts/verify-mask-pii.mjs
git commit -m "feat(org-users): add PII masking helpers"
```

---

### Task 2: Wire org users table

**Files:**
- Modify: `src/components/customs/org-dashboard/organizations/org-users/users-list/table.tsx`

- [ ] **Step 1: Import helpers and wrap cell renders** for `firstName`, `lastName`, `email`, `phoneNumber`, `address`. Guard `address` when missing (avoid `.slice` on undefined).

- [ ] **Step 2:** `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(org-users): mask PII columns in organization users list"
```

---

### Task 3: Docs

- [ ] Mark backlog 5.6 `done`; design status `Implemented`.
- [ ] Commit docs.

---

## Manual QA

1. Open `/org/users`
2. Confirm name/email/phone/address show asterisks with a few visible chars
3. Profile images still load
4. Super-admin `/dashboard/users` unchanged
