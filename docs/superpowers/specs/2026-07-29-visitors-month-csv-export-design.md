# Visitors Activity Log — Month Filter + CSV Export

> **Status:** Implemented on org-admin `/org/visitors`  
> **Date:** 2026-07-29  
> **Surface:** Org admin `/org/visitors` (Visitors Logs)  
> **Backlog:** 2.3

## Goal

Filter visitors by calendar month and export **all** matching rows as CSV. Month basis is a swappable enum (default `checkedInAt`).

## Organization

| Path | Responsibility |
|------|----------------|
| `src/lib/visitors/month-basis.ts` | `VisitorMonthBasis` enum + `VISITOR_MONTH_BASIS` default |
| `src/lib/visitors/filter-by-month.ts` | Pure filter/helpers for YYYY-MM |
| `src/lib/visitors/export-csv.ts` | Build CSV + trigger download (same pattern as QR download in `utils.ts`) |
| `.../visitors-log/month-filter.tsx` | Month/year UI using existing `Select` + `Button` |
| `.../visitors-log/index.tsx` | Wire filter, fetch-for-month, Export button |
| `hooks/use-visitors.ts` + `visitors-api.ts` | Lazy/full fetch support for export |

Reuse: `@/components/ui/select`, `@/components/ui/button`, `date-fns`, toast via `sonner`.

## Month basis

```ts
export enum VisitorMonthBasis {
  CheckedInAt = "checkedInAt",
  CreatedAt = "createdAt",
  StartTime = "startTime",
}
export const VISITOR_MONTH_BASIS = VisitorMonthBasis.CheckedInAt
```

## Behavior

1. Header: month + year selects (default: current month) + **Export CSV**.
2. Load full org visitor set (paginate until complete or `limit = total`), filter by `VISITOR_MONTH_BASIS` in selected month.
3. Table shows filtered rows; Export downloads `visitors-YYYY-MM.csv`.
4. Empty month → toast, no file.

## Out of scope

- Super-admin export
- Backend `?month=` param (can replace fetch strategy later without changing enum)
