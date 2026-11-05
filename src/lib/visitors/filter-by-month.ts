import {
  VISITOR_MONTH_BASIS,
  type VisitorMonthBasis,
} from "@/lib/visitors/month-basis"
import type { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"

export type YearMonth = {
  year: number
  /** 1–12 */
  month: number
}

/** Either a whole month, or a single calendar day (local time). */
export type VisitorPeriod =
  | ({ kind: "month" } & YearMonth)
  | ({ kind: "day"; day: number } & YearMonth)

export function toYearMonthKey({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`
}

export function toPeriodKey(period: VisitorPeriod): string {
  const monthKey = toYearMonthKey(period)
  return period.kind === "day"
    ? `${monthKey}-${String(period.day).padStart(2, "0")}`
    : monthKey
}

export function parseYearMonthKey(key: string): YearMonth | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null
  return { year, month }
}

export function currentYearMonth(now = new Date()): YearMonth {
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

export function periodToDate(period: VisitorPeriod): Date {
  return new Date(
    period.year,
    period.month - 1,
    period.kind === "day" ? period.day : 1,
  )
}

export function dateToDayPeriod(date: Date): VisitorPeriod {
  return {
    kind: "day",
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }
}

/** [start, end) epoch-ms bounds of the period in the viewer's local time. */
function periodBounds(period: VisitorPeriod): [number, number] {
  const { year, month } = period
  if (period.kind === "day") {
    return [
      new Date(year, month - 1, period.day).getTime(),
      new Date(year, month - 1, period.day + 1).getTime(),
    ]
  }
  return [
    new Date(year, month - 1, 1).getTime(),
    new Date(year, month, 1).getTime(),
  ]
}

function toTime(value: unknown): number | null {
  if (value == null || value === "") return null
  const t =
    value instanceof Date ? value.getTime() : new Date(String(value)).getTime()
  return Number.isNaN(t) ? null : t
}

/**
 * Keep rows whose visit date falls inside `period`. A row's visit date is its
 * check-in time; rows that were never checked in (pending, canceled, expired)
 * fall back to the configured basis date.
 */
export function filterVisitorsByPeriod<T extends ActiveVisitorsLogTableTypes>(
  visitors: T[],
  period: VisitorPeriod,
  basis: VisitorMonthBasis = VISITOR_MONTH_BASIS,
): T[] {
  const [start, end] = periodBounds(period)
  return visitors.filter((row) => {
    const t = toTime(row.checkedInAt) ?? toTime(row[basis])
    return t !== null && t >= start && t < end
  })
}

/** Keep rows whose configured month-basis date falls in `ym`. */
export function filterVisitorsByMonth<T extends ActiveVisitorsLogTableTypes>(
  visitors: T[],
  ym: YearMonth,
  basis: VisitorMonthBasis = VISITOR_MONTH_BASIS,
): T[] {
  return filterVisitorsByPeriod(visitors, { kind: "month", ...ym }, basis)
}
