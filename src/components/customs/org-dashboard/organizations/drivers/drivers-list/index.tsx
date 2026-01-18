"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { DriversListTable } from './table'
import { DriversSkeleton } from './skeleton'
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"


function DriversList() {
    const { user } = useSelector((state: RootState) => state.auth);
    const inviterId = user?._id as string;
    const { orgDrivers, loadingOrgDrivers } = useOrganization({ fetchAllUsers: true, inviterId });

    // Show skeleton loader while loading
    if (loadingOrgDrivers) {
        return <DriversSkeleton />
    }

    return (
        <Card className={"rounded-sm  px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Drivers Lists</h1>
                    <p className={"text-sm pt-2"}>List of all registered Drivers</p>
                </div>
                <Link href={"/org/drivers/create"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Add New Driver <IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <DriversListTable data={orgDrivers || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default DriversList
