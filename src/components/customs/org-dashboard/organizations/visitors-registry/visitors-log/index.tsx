"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import useVisitors from "@/hooks/use-visitors"
import { expandVisitorVisits } from "@/lib/visitors/expand-visits"
import { downloadVisitorsCsv } from "@/lib/visitors/export-csv"
import {
  currentYearMonth,
  filterVisitorsByPeriod,
  periodToDate,
  type VisitorPeriod,
} from "@/lib/visitors/filter-by-month"
import { RootState } from "@/lib/store"
import type { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"
import { IconAlertTriangle, IconDownload, IconPlus, IconRefresh } from "@tabler/icons-react"
import { format } from "date-fns"
import Link from "next/link"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { VisitorsMonthFilter } from "./month-filter"
import { VisitorsLogSkeleton } from "./skeleton"
import { ActiveVisitorsLogTable } from "./table"

const noop = () => {}

function describePeriod(period: VisitorPeriod): string {
  const date = periodToDate(period)
  return period.kind === "day"
    ? format(date, "EEE, MMM d, yyyy")
    : format(date, "MMMM yyyy")
}

function errorMessage(error: unknown, fallback: string): string {
  return (error as { data?: { message: string } })?.data?.message || fallback
}

function ActiveVisitorsLog() {
  const [period, setPeriod] = useState<VisitorPeriod>(() => ({
    kind: "month",
    ...currentYearMonth(),
  }))
  /** Every visitor for the org; `null` until the first load completes. */
  const [allRows, setAllRows] = useState<ActiveVisitorsLogTableTypes[] | null>(null)
  const [loadingAll, setLoadingAll] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const requestIdRef = useRef(0)

  const { user } = useSelector((state: RootState) => state.auth)
  const orgId = user?._id as string
  // This query only feeds the stats cards; the log table uses `allRows`.
  const { visitor, loadingVisitor, fetchAllOrgVisitors } = useVisitors({
    fetchVisitor: true,
    orgId,
    meta: { page: 1, limit: 10 },
  })

  const loadAllRows = useCallback(async () => {
    if (!orgId) return
    const requestId = ++requestIdRef.current
    setLoadingAll(true)
    setLoadError(null)
    try {
      const rows = await fetchAllOrgVisitors(orgId)
      // Ignore responses that were superseded by a newer request.
      if (requestId !== requestIdRef.current) return
      setAllRows(rows)
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return
      const message = errorMessage(error, "Failed to load visitors")
      setLoadError(message)
      toast.error(message)
    } finally {
      if (requestId === requestIdRef.current) setLoadingAll(false)
    }
  }, [orgId, fetchAllOrgVisitors])

  useEffect(() => {
    void loadAllRows()
  }, [loadAllRows])

  // When the stats query refetches (after a check-out/cancel/update, window
  // refocus, reconnect), refresh the full list too so the log stays accurate.
  const lastVisitorRef = useRef(visitor)
  useEffect(() => {
    const previous = lastVisitorRef.current
    lastVisitorRef.current = visitor
    if (previous && visitor && previous !== visitor) void loadAllRows()
  }, [visitor, loadAllRows])

  // One row per visit (records reused across days keep each day's own times).
  const visitRows = useMemo(
    () => (allRows ? expandVisitorVisits(allRows) : null),
    [allRows],
  )

  // Filtering is in-memory, so switching month/day is instant.
  const periodRows = useMemo(
    () => (visitRows ? filterVisitorsByPeriod(visitRows, period) : []),
    [visitRows, period],
  )

  const initialLoading = allRows === null && loadingAll
  const refreshing = allRows !== null && loadingAll
  const periodLabel = describePeriod(period)

  const handleExport = async () => {
    if (!orgId) return
    setExporting(true)
    try {
      const rows = visitRows
        ? periodRows
        : filterVisitorsByPeriod(
            expandVisitorVisits(await fetchAllOrgVisitors(orgId)),
            period,
          )

      if (!rows.length) {
        toast.error(`No visits found for ${periodLabel}`)
        return
      }

      downloadVisitorsCsv(rows, period)
      toast.success(`Exported ${rows.length} visit(s)`)
    } catch (error: unknown) {
      toast.error(errorMessage(error, "Failed to export visitors"))
    } finally {
      setExporting(false)
    }
  }

  const stats = [
    {
      title: "Active Visitors",
      value: visitor?.stats.activeVisitors,
    },
    {
      title: "Pending Arrivals",
      value: visitor?.stats.pendingArrivals,
    },
    {
      title: "Today's Visits",
      value: visitor?.stats.todaysVisits,
    },
    {
      title: "Total Visits",
      value: visitor?.stats.totalVisits,
    },
  ]

  if (loadingVisitor && !visitor) {
    return <VisitorsLogSkeleton />
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="rounded shadow flex flex-row justify-between items-center p-4"
          >
            <h1 className="text-sm font-medium text-gray-600 font-poppins">
              {stat.title}
            </h1>
            <p className="text-sm font-bold text-gray-600 font-poppins">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="flex justify-start">
        <Link href={"/org/visitors/verify"}>
          <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded text-white"}>
            Verify Visitor/Personnel Code
            <IconPlus />
          </Button>
        </Link>
      </div>

      <Card className={"rounded mt-5 px-3 min-w-full shadow"}>
        <CardHeader className="flex flex-col gap-4 px-0 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className={"font-semibold text-xl"}>Visitors Logs</h1>
            <p className={"text-sm pt-2"}>
              History of all visitors who have checked in and out
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-end gap-3">
              <VisitorsMonthFilter value={period} onChange={setPeriod} />
              <Button
                type="button"
                variant="outline"
                className="rounded"
                disabled={exporting || initialLoading}
                onClick={() => void handleExport()}
              >
                {exporting ? <Spinner /> : <IconDownload />}
                <span className="hidden lg:inline">
                  {exporting ? "Exporting…" : "Export CSV"}
                </span>
              </Button>
              <Link href={"/org/visitors/generate-pass"}>
                <Button
                  className={
                    "bg-[#EF4136] hover:bg-[#EF4136]/50 rounded text-white"
                  }
                >
                  <span className="hidden lg:inline">Generate Pass </span>
                  <IconPlus />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded border bg-muted/40 px-3 py-2">
          <p className="text-sm">
            {initialLoading ? (
              <span className="text-muted-foreground">Loading visitors…</span>
            ) : (
              <>
                <span className="font-semibold">{periodRows.length}</span>{" "}
                visit{periodRows.length === 1 ? "" : "s"}{" "}
                {period.kind === "day" ? "on" : "in"}{" "}
                <span className="font-semibold">{periodLabel}</span>
              </>
            )}
          </p>
          {refreshing && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EF4136]">
              <Spinner className="size-3.5" />
              Updating…
            </span>
          )}
        </div>

        <div
          className={`relative overflow-x-auto md:max-w-md min-w-full ${
            initialLoading ? "min-h-[320px]" : ""
          }`}
        >
          {loadError && allRows === null ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
              <IconAlertTriangle className="size-10 text-[#EF4136]" />
              <div>
                <p className="font-semibold">Couldn&apos;t load visitors</p>
                <p className="text-sm text-muted-foreground">{loadError}</p>
              </div>
              <Button
                variant="outline"
                className="rounded"
                onClick={() => void loadAllRows()}
              >
                <IconRefresh />
                Try again
              </Button>
            </div>
          ) : (
            <>
              <Suspense>
                <ActiveVisitorsLogTable
                  data={periodRows}
                  setLimit={noop}
                  setPage={noop}
                />
              </Suspense>
              {initialLoading && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute inset-0 z-20 flex min-h-[320px] flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm"
                >
                  <Spinner className="size-10 text-[#EF4136]" />
                  <div className="text-center">
                    <p className="font-semibold">Loading visitors</p>
                    <p className="text-sm text-muted-foreground">
                      Fetching the visitor log for {periodLabel}…
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </section>
  )
}

export default ActiveVisitorsLog
