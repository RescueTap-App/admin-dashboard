"use client"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  currentYearMonth,
  toYearMonthKey,
  type YearMonth,
} from "@/lib/visitors/filter-by-month"

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function yearOptions(centerYear: number): number[] {
  return [centerYear - 2, centerYear - 1, centerYear, centerYear + 1]
}

type VisitorsMonthFilterProps = {
  value: YearMonth
  onChange: (next: YearMonth) => void
}

export function VisitorsMonthFilter({ value, onChange }: VisitorsMonthFilterProps) {
  const now = currentYearMonth()

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="visitors-month" className="text-sm font-medium">
          Month
        </Label>
        <Select
          value={String(value.month)}
          onValueChange={(month) =>
            onChange({ year: value.year, month: Number(month) })
          }
        >
          <SelectTrigger id="visitors-month" size="default" className="w-[140px] rounded">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_LABELS.map((label, index) => (
              <SelectItem key={label} value={String(index + 1)}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="visitors-year" className="text-sm font-medium">
          Year
        </Label>
        <Select
          value={String(value.year)}
          onValueChange={(year) =>
            onChange({ year: Number(year), month: value.month })
          }
        >
          <SelectTrigger id="visitors-year" size="default" className="w-[100px] rounded">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions(now.year).map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground pb-2">
        Filter: {toYearMonthKey(value)}
      </p>
    </div>
  )
}
