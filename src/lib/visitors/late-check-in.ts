import type { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"

/** Grace period after scheduled start before marking late (ms). Tune as needed. */
export const LATE_CHECK_IN_GRACE_MS = 0

type LateVisitorInput = Pick<
  ActiveVisitorsLogTableTypes,
  "status" | "startTime" | "checkedInAt"
>

/**
 * Late if:
 * - still pending and now is past startTime (+ grace), or
 * - checked in after startTime (+ grace)
 */
export function isVisitorLate(
  visitor: LateVisitorInput,
  now: Date = new Date(),
): boolean {
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
