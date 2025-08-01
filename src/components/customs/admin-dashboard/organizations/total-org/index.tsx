import { Card, CardHeader } from '@/components/ui/card'
import React, { Suspense } from 'react'
import { TotalOrganizationTable } from './table'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { OrganizationTableType } from '@/types/organization.types'
import useOrganization from '@/hooks/use-organization'

const mockOrganizations: OrganizationTableType[] = [
    {
        id: 'org-001',
        organization: 'GreenTech Solutions',
        category: 'Commercial',
        slotsTaken: 45,
        slotsAlloted: 50,
        status: 'Active',
        adminEmail: 'admin@greentech.com',
        dateCreated: new Date('2024-12-10'),
        dueDate: new Date('2025-12-10'),
    },
    {
        id: 'org-002',
        organization: 'SafeHome Apartments',
        category: 'Residential',
        slotsTaken: 20,
        slotsAlloted: 30,
        status: 'Pending',
        adminEmail: 'contact@safehome.com',
        dateCreated: new Date('2025-01-15'),
        dueDate: new Date('2025-07-15'),
    },
    {
        id: 'org-003',
        organization: 'MetroPark Inc.',
        category: 'Commercial',
        slotsTaken: 100,
        slotsAlloted: 120,
        status: 'Expired',
        adminEmail: 'support@metropark.com',
        dateCreated: new Date('2023-07-01'),
        dueDate: new Date('2024-07-01'),
    },
    {
        id: 'org-004',
        organization: 'Urban Nest Estates',
        category: 'Residential',
        slotsTaken: 10,
        slotsAlloted: 25,
        status: 'Active',
        adminEmail: 'urban@nest.com',
        dateCreated: new Date('2025-04-20'),
        dueDate: new Date('2026-04-20'),
    },
    {
        id: 'org-005',
        organization: 'BrightPath Schools',
        category: 'Commercial',
        slotsTaken: 75,
        slotsAlloted: 80,
        status: 'Suspended',
        adminEmail: 'admin@brightpath.edu',
        dateCreated: new Date('2024-09-05'),
        dueDate: new Date('2025-09-05'),
    },
];


function TotalOrganizations() {
    const { orgUsers } = useOrganization({ fetchAllUsers: true });
    
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Organizations Overview</h1>
                    <p className={"text-sm pt-2"}>Summary of all organizations and their vehicle slot usage.</p>
                </div>
                <Link href={"/dashboard/organizations/create"}>
                    <Button size="lg" className="bg-[#EF4136] hover:bg-[#EF4136]/50 rounded px-5 ">
                        <span className="hidden lg:inline font-lato">Add New Organization</span>
                        <IconPlus />
                    </Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <TotalOrganizationTable data={mockOrganizations} />
                </Suspense>
            </div>
        </Card>
    )
}

export default TotalOrganizations
