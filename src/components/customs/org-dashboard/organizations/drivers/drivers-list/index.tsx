"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { DriversListTable } from './table'


function DriversList() {
    const { allDrivers } = useOrganization({ fetchAllDrivers: true })
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Drivers List</h1>
                    <p className={"text-sm pt-2"}>List of all registered Drivers</p>
                </div>
                <Link href={"/dashboard/drivers/create"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Add New Driver <IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <DriversListTable data={allDrivers || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default DriversList
