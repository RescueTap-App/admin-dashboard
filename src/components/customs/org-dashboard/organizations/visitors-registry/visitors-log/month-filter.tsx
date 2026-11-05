"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  currentYearMonth,
  dateToDayPeriod,
  periodToDate,
  type VisitorPeriod,
} from "@/lib/visitors/filter-by-month"
import { cn } from "@/lib/utils"
import { IconCalendar } from "@tabler/icons-react"
import { format } from "date-fns"
import { useState } from "react"

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

type VisitorsPeriodFilterProps = {
  value: VisitorPeriod
  onChange: (next: VisitorPeriod) => void
}

export function VisitorsMonthFilter({ value, onChange }: VisitorsPeriodFilterProps) {
  const now = currentYearMonth()
  const [calendarOpen, setCalendarOpen] = useState(false)

  const switchMode = (kind: VisitorPeriod["kind"]) => {
    if (kind === value.kind) return
    if (kind === "day") {
      // Keep the selected month; land on today if it's the current month, else the 1st.
      const today = new Date()
      const sameMonth =
        value.year === today.getFullYear() && value.month === today.getMonth() + 1
      onChange({
        kind: "day",
        year: value.year,
        month: value.month,
        day: sameMonth ? today.getDate() : 1,
      })
    } else {
      onChange({ kind: "month", year: value.year, month: value.month })
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-medium">Filter by</Label>
        <div
          role="radiogroup"
          aria-label="Filter visitors by"
          className="inline-flex h-9 rounded border bg-muted p-0.5"
        >
          {(["month", "day"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              role="radio"
              aria-checked={value.kind === kind}
              onClick={() => switchMode(kind)}
              className={cn(
                "rounded-sm px-3 text-sm font-medium capitalize transition-colors",
                value.kind === kind
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      {value.kind === "day" ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visitors-day" className="text-sm font-medium">
            Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="visitors-day"
                variant="outline"
                className="w-[180px] justify-start rounded font-normal"
              >
                <IconCalendar />
                {format(periodToDate(value), "EEE, MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={periodToDate(value)}
                defaultMonth={periodToDate(value)}
                captionLayout="dropdown"
                startMonth={new Date(now.year - 2, 0)}
                endMonth={new Date(now.year + 1, 11)}
                onSelect={(date) => {
                  if (!date) return
                  onChange(dateToDayPeriod(date))
                  setCalendarOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="visitors-month" className="text-sm font-medium">
              Month
            </Label>
            <Select
              value={String(value.month)}
              onValueChange={(month) =>
                onChange({ kind: "month", year: value.year, month: Number(month) })
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
                onChange({ kind: "month", year: Number(year), month: value.month })
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
        </>
      )}
    </div>
  )
}
