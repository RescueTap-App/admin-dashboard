"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { ActiveVisitorsTableTypes } from "@/types/visitors.types"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { ActiveVisitorsTable } from './table'
import { Suspense } from "react"


const mockVisitors: ActiveVisitorsTableTypes[] = [
    {
        id: 'org-001',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM"
    },
    {
        id: 'org-002',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM"
    },
    {
        id: 'org-003',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM"
    },
    {
        id: 'org-004',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM"
    },
    {
        id: 'org-005',
        visitorsName: 'John Doe',
        tagNumber: "BH-0001",
        phone: "+2349900883377",
        purpose: "Delivery",
        regNumber: "AAC-002-XY",
        hostName: 'John Cater',
        check_in_time: "09:30AM"
    },
];


function ActiveVisitors() {
    return (
        <Card className={"rounded mt-5 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Visitors Currently on Premises </h1>
                    <p className={"text-sm pt-2"}>List of all active visitors currently checked in</p>
                </div>
                <Link href={"/org/vistors/generate-pass"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Generate Pass  <IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <ActiveVisitorsTable data={mockVisitors}/>
                </Suspense>
            </div>
        </Card>
    )
}

export default ActiveVisitors
