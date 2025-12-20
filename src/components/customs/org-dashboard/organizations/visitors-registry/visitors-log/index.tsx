"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useVisitors from "@/hooks/use-visitors"
import { RootState } from "@/lib/store"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense, useState } from "react"
import { useSelector } from "react-redux"
import { ActiveVisitorsLogTable } from './table'
import { VisitorsLogSkeleton } from './skeleton'


function ActiveVisitorsLog() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const { user } = useSelector((state: RootState) => state.auth);
    const orgId = user?._id as string;
    const { visitor, loadingVisitor } = useVisitors({ fetchVisitor: true, orgId, meta: { page, limit } });

    const stats = [
        {
            title: "Active Visitors",
            value: visitor?.stats.activeVisitors
        },
        {
            title: "Pending Arrivals",
            value: visitor?.stats.pendingArrivals
        },
        {
            title: "Today's Visits",
            value: visitor?.stats.todaysVisits
        },
        {
            title: "Total Visits",
            value: visitor?.stats.totalVisits
        }
    ]

    // Show skeleton loader while loading
    if (loadingVisitor) {
        return <VisitorsLogSkeleton />
    }

    return (
        <section className="flex flex-col gap-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="rounded shadow flex flex-row justify-between items-center p-4">
                        <h1 className="text-sm font-medium text-gray-600 font-poppins">{stat.title}</h1>
                        <p className="text-sm font-bold text-gray-600 font-poppins">{stat.value}</p>
                    </Card>
                ))}
            </div>

            <div className="flex justify-start">
                <Link href={"/org/visitors/verify"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded text-white"}>
                        Verify Visitor Code
                        <IconPlus />
                    </Button>
                </Link>
            </div>

            <Card className={"rounded mt-5 px-3 min-w-full shadow"}>
                <CardHeader className='flex flex-row justify-between px-0'>
                    <div>
                        <h1 className={"font-semibold text-xl"}>Visitors Logs</h1>
                        <p className={"text-sm pt-2"}>History of all visitors who have checked in and out</p>
                    </div>
                    <div className={"flex flex-row justify-between gap-3"}>
                        <Link href={"/org/visitors/generate-pass"}>
                            <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded text-white"}><span className="hidden lg:inline">Generate Pass </span><IconPlus /></Button>
                        </Link>
                    </div>
                </CardHeader>
                <div className='overflow-x-auto md:max-w-md min-w-full'>
                    <Suspense>
                        <ActiveVisitorsLogTable
                            data={visitor?.visitors || []}
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
