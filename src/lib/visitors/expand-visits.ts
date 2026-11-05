import type {
  ActiveVisitorsLogTableTypes,
  CheckInHistoryEntry,
  VisitorLogRow,
} from "@/types/visitors.types"

function toTime(value: unknown): number | null {
  if (value == null || value === "") return null
  const t =
    value instanceof Date ? value.getTime() : new Date(String(value)).getTime()
  return Number.isNaN(t) ? null : t
}

/** Two timestamps within this window are treated as the same check-in. */
const SAME_CHECK_IN_MS = 2_000

/**
 * The backend reuses one visitor record across visits (persistent passes,
 * personal QR self-scans) and overwrites its top-level `checkedInAt` each time,
 * keeping earlier check-ins only in `history`. Expand each record into one row
 * per visit so past visits keep their own times.
 */
export function expandVisitorVisits(
  records: ActiveVisitorsLogTableTypes[],
): VisitorLogRow[] {
  const rows: VisitorLogRow[] = []

  for (const record of records) {
    const recordId = String(record._id)

    const visits: CheckInHistoryEntry[] = (record.history ?? [])
      .filter((entry) => toTime(entry?.checkedInAt) !== null)
      .sort((a, b) => toTime(a.checkedInAt)! - toTime(b.checkedInAt)!)

    // Guard against a latest check-in that hasn't made it into history yet.
    const latestTop = toTime(record.checkedInAt)
    if (
      visits.length > 0 &&
      latestTop !== null &&
      latestTop - toTime(visits[visits.length - 1].checkedInAt)! >= SAME_CHECK_IN_MS
    ) {
      visits.push({
        checkedInAt: record.checkedInAt,
        checkedOutAt: record.checkedOutAt,
      })
    }

    if (visits.length === 0) {
      rows.push({
        ...record,
        recordId,
        visitIndex: null,
        visitCount: latestTop !== null ? 1 : 0,
        isLatestVisit: true,
      })
      continue
    }

    visits.forEach((visit, index) => {
      const isLatestVisit = index === visits.length - 1
      const checkInTime = toTime(visit.checkedInAt)!
      const recordCheckOut = toTime(record.checkedOutAt)
      const checkedOutAt =
        visit.checkedOutAt ??
        (isLatestVisit && recordCheckOut !== null && recordCheckOut >= checkInTime
          ? record.checkedOutAt
          : undefined)

      rows.push({
        ...record,
        _id: `${recordId}:${index}`,
        recordId,
        visitIndex: index,
        visitCount: visits.length,
        isLatestVisit,
        checkedInAt: visit.checkedInAt,
        checkedOutAt,
        // Earlier visits are over (they checked in again afterwards); the
        // latest one carries the record's live status.
        status: isLatestVisit ? record.status : "checked_out",
      })
    })
  }

  // Most recent activity first.
  return rows.sort(
    (a, b) => (activityTime(b) ?? 0) - (activityTime(a) ?? 0),
  )
}

/** When this row happened: its check-in, or creation time if never checked in. */
export function activityTime(
  row: Pick<ActiveVisitorsLogTableTypes, "checkedInAt" | "createdAt">,
): number | null {
  return toTime(row.checkedInAt) ?? toTime(row.createdAt)
}
