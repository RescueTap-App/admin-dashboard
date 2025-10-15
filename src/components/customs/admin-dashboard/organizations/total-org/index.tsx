"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Fragment, Suspense } from 'react'
import { TotalOrganizationTable } from './table'
import StatsCard from "../stats-card"
function Oraganizations() {
    const { organizations, analytics } = useOrganization({ fetchAllOrgs: true })

    return (
        <Fragment>
            <StatsCard data={analytics} />
            <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
                <CardHeader className='flex flex-row justify-between px-0'>
                    <div>
                        <h1 className={"font-semibold text-xl"}>Organization List</h1>
                        <p className={"text-sm pt-2"}>List of all Organization</p>
                    </div>
                    <Link href={"/dashboard/organizations/create"} passHref>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className="hidden lg:inline">Create New Organization</span>
                            <IconPlus />
                        </Button>
                    </Link>
                </CardHeader>
                <div className='overflow-x-auto md:max-w-md min-w-full'>
                    <Suspense>
                        <TotalOrganizationTable data={organizations?.data || []} />
                    </Suspense>
                </div>
            </Card>
        </Fragment>
    )
}

export default Oraganizations
