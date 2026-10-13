"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import useVisitors from "@/hooks/use-visitors"
import { downloadVisitorsCsv } from "@/lib/visitors/export-csv"
import {
  currentYearMonth,
  filterVisitorsByMonth,
  type YearMonth,
} from "@/lib/visitors/filter-by-month"
import { RootState } from "@/lib/store"
import type { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"
import { IconDownload, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"
import { VisitorsMonthFilter } from "./month-filter"
import { VisitorsLogSkeleton } from "./skeleton"
import { ActiveVisitorsLogTable } from "./table"

function ActiveVisitorsLog() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [yearMonth, setYearMonth] = useState<YearMonth>(() => currentYearMonth())
  const [monthRows, setMonthRows] = useState<ActiveVisitorsLogTableTypes[]>([])
  const [loadingMonth, setLoadingMonth] = useState(false)
  const [exporting, setExporting] = useState(false)

  const { user } = useSelector((state: RootState) => state.auth)
  const orgId = user?._id as string
  const { visitor, loadingVisitor, fetchAllOrgVisitors } = useVisitors({
    fetchVisitor: true,
    orgId,
    meta: { page, limit },
  })

  const loadMonthRows = useCallback(async () => {
    if (!orgId) return
    setLoadingMonth(true)
    try {
      const all = await fetchAllOrgVisitors(orgId)
      setMonthRows(filterVisitorsByMonth(all, yearMonth))
    } catch (error: unknown) {
      const message =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to load visitors for this month"
      toast.error(message)
      setMonthRows([])
    } finally {
      setLoadingMonth(false)
    }
  }, [orgId, yearMonth, fetchAllOrgVisitors])

  useEffect(() => {
    void loadMonthRows()
  }, [loadMonthRows])

  const handleExport = async () => {
    if (!orgId) return
    setExporting(true)
    try {
      const all = await fetchAllOrgVisitors(orgId)
      const rows = filterVisitorsByMonth(all, yearMonth)

      if (!rows.length) {
        toast.error("No visitors found for the selected month")
        return
      }

      downloadVisitorsCsv(rows, yearMonth)
      toast.success(`Exported ${rows.length} visitor(s)`)
    } catch (error: unknown) {
      const message =
        (error as { data?: { message: string } })?.data?.message ||
        "Failed to export visitors"
      toast.error(message)
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
              <VisitorsMonthFilter value={yearMonth} onChange={setYearMonth} />
              <Button
                type="button"
                variant="outline"
                className="rounded"
                disabled={exporting || loadingMonth}
                onClick={() => void handleExport()}
              >
                <IconDownload />
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
            <p className="text-xs text-muted-foreground">
              {loadingMonth
                ? "Loading month…"
                : `${monthRows.length} visitor(s) in selected month`}
            </p>
          </div>
        </CardHeader>
        <div className="overflow-x-auto md:max-w-md min-w-full">
          <Suspense>
            <ActiveVisitorsLogTable
              data={monthRows}
              setLimit={setLimit}
              setPage={setPage}
            />
          </Suspense>
        </div>
      </Card>
    </section>
  )
}

export default ActiveVisitorsLog
