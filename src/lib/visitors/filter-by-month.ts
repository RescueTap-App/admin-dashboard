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

export function toYearMonthKey({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`
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

function dateBelongsToMonth(value: unknown, ym: YearMonth): boolean {
  if (value == null || value === "") return false
  const d = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(d.getTime())) return false
  return d.getFullYear() === ym.year && d.getMonth() + 1 === ym.month
}

/** Keep rows whose configured month-basis date falls in `ym`. */
export function filterVisitorsByMonth(
  visitors: ActiveVisitorsLogTableTypes[],
  ym: YearMonth,
  basis: VisitorMonthBasis = VISITOR_MONTH_BASIS,
): ActiveVisitorsLogTableTypes[] {
  return visitors.filter((row) => dateBelongsToMonth(row[basis], ym))
}
