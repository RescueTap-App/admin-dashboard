"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { ActiveVisitorsLogTableTypes } from "@/types/visitors.types"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { ActiveVisitorsLogTable } from './table'
import { Suspense } from "react"


const mockVisitors: ActiveVisitorsLogTableTypes[] = [
    {
        id: 'org-001',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM",
        check_out_time: "09:30PM"
    },
    {
        id: 'org-002',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM",
        check_out_time: "09:30PM"
    },
    {
        id: 'org-003',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM",
        check_out_time: "09:30PM"
    },
    {
        id: 'org-004',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM",
        check_out_time: "09:30PM"
    },
    {
        id: 'org-005',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM",
        check_out_time: "09:30PM"
    },
];


function ActiveVisitorsLog() {
    return (
        <Card className={"rounded mt-5 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Visitors Logs</h1>
                    <p className={"text-sm pt-2"}>History of all visitors who have checked in and out</p>
                </div>
                <div className={"flex flex-row justify-between gap-3"}>
                    <Link href={"/org/visitors"}>
                        <Button variant={"outline"} className={"borderborder-[#EF4136] rounded text-black"}>See Active Visitors  <IconPlus /></Button>
                    </Link>

                    <Link href={"/org/visitors/generate-pass"}>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded text-white"}>Generate Pass  <IconPlus /></Button>
                    </Link>
                </div>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <ActiveVisitorsLogTable data={mockVisitors} />
                </Suspense>
            </div>
        </Card>
    )
}

export default ActiveVisitorsLog
