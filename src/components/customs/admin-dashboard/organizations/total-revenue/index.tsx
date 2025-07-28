import { Card, CardHeader } from '@/components/ui/card'
import { TotalRevenueTable } from './table'
import { RevenueTypes } from '@/types/organization.types'
import { formatCurrency } from '@/lib/utils'
import React, { Suspense } from 'react'

const mockRevenue: RevenueTypes[] = [
    {
        id: 'org-001',
        organization: 'GreenTech Solutions',
        amount: 45,
        status: 'paid',
        period: '2024-12-10',
        billingDate: new Date('2025-12-10'),
    },
    {
        id: 'org-002',
        organization: 'GreenTech Solutions',
        amount: 45,
        status: 'pending',
        period: '2024-12-10',
        billingDate: new Date('2025-12-10'),
    },
    {
        id: 'org-003',
        organization: 'GreenTech Solutions',
        amount: 45,
        status: 'paid',
        period: '2024-12-10',
        billingDate: new Date('2025-12-10'),
    },
    {
        id: 'org-004',
        organization: 'GreenTech Solutions',
        amount: 45,
        status: 'paid',
        period: '2024-12-10',
        billingDate: new Date('2025-12-10'),
    },
    {
        id: 'org-005',
        organization: 'GreenTech Solutions',
        amount: 45,
        status: 'pending',
        period: '2024-12-10',
        billingDate: new Date('2025-12-10'),
    },
];


function RevenueBrakedown() {
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Revenue Breakdown</h1>
                    <p className={"text-sm pt-2"}>Revenue details from all organizations</p>
                </div>
                <h1 className='font-bold font-lato text-xl'>{formatCurrency(2400000)}</h1>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <TotalRevenueTable data={mockRevenue} />
                </Suspense>
            </div>
        </Card>
    )
}

export default RevenueBrakedown
