"use client"

import { Card, CardHeader } from '@/components/ui/card'
import { TotalRevenueTable } from './table'
// import { formatCurrency } from '@/lib/utils'
import React, { Suspense } from 'react'
import useOrganization from "@/hooks/use-organization"


function RevenueBrakedown() {
    const { organizations } = useOrganization({ fetchAllOrgs: true });

    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Revenue Breakdown</h1>
                    <p className={"text-sm pt-2"}>Revenue details from all organizations</p>
                </div>
                {/* <h1 className='font-bold font-lato text-xl'>{formatCurrency(2400000)}</h1> */}
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <TotalRevenueTable data={organizations?.data || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default RevenueBrakedown
