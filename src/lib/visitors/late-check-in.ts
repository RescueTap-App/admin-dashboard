import type { VisitorLogRow } from "@/types/visitors.types"

/** Grace period after scheduled start before marking late (ms). Tune as needed. */
export const LATE_CHECK_IN_GRACE_MS = 0

type LateVisitorInput = Pick<
  VisitorLogRow,
  "status" | "startTime" | "checkedInAt"
> &
  Partial<Pick<VisitorLogRow, "isPersistent" | "visitIndex">>

/**
 * Late if:
 * - still pending and now is past startTime (+ grace), or
 * - checked in after startTime (+ grace)
 *
 * Only the first visit of a scheduled pass is judged. Persistent passes and
 * repeat visits have no schedule of their own: their `startTime` is when the
 * record was first set up, so every later check-in would look "late".
 */
export function isVisitorLate(
  visitor: LateVisitorInput,
  now: Date = new Date(),
): boolean {
  if (visitor.isPersistent) return false
  if (visitor.visitIndex != null && visitor.visitIndex > 0) return false

  const start = new Date(visitor.startTime)
  if (Number.isNaN(start.getTime())) return false

  const due = start.getTime() + LATE_CHECK_IN_GRACE_MS

  if (visitor.status === "pending") {
    return now.getTime() > due
  }

  if (visitor.checkedInAt) {
    const checkedIn = new Date(visitor.checkedInAt)
    if (Number.isNaN(checkedIn.getTime())) return false
    return checkedIn.getTime() > due
  }

  return false
}
