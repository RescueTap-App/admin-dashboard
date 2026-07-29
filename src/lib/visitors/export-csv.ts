import type { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"
import { toYearMonthKey, type YearMonth } from "@/lib/visitors/filter-by-month"

function csvEscape(value: unknown): string {
  const raw = value == null ? "" : String(value)
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`
  }
  return raw
}

function hostName(row: ActiveVisitorsLogTableTypes): string {
  const t = row.tenantId
  if (!t) return ""
  return `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim()
}

const CSV_HEADERS = [
  "Name",
  "Phone",
  "Purpose",
  "Status",
  "Vehicle Number",
  "Entry Code",
  "Host",
  "Visitors Count",
  "Checked In At",
  "Start Time",
  "End Time",
  "Created At",
] as const

export function visitorsToCsv(rows: ActiveVisitorsLogTableTypes[]): string {
  const lines = [
    CSV_HEADERS.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.phone,
        row.purpose,
        row.status,
        row.vehicleNumber,
        row.entryCode,
        hostName(row),
        row.noOfVisitors,
        row.checkedInAt,
        row.startTime,
        row.endTime,
        row.createdAt,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ]
  return lines.join("\n")
}

/** Same download pattern as QR export in `lib/utils.ts`. */
export function downloadVisitorsCsv(
  rows: ActiveVisitorsLogTableTypes[],
  ym: YearMonth,
): void {
  const csv = visitorsToCsv(rows)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `visitors-${toYearMonthKey(ym)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
