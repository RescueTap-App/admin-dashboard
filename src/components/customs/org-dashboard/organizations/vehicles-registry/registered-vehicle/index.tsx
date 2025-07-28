"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { RegisteredVehicleTableTypes } from "@/types/vehicles.types"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { RegisteredVehicleTable } from './table'
import { Suspense } from "react"

const mockRevenue: RegisteredVehicleTableTypes[] = [
    {
        id: 'org-001',
        owner: 'John Doe',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
    {
        id: 'org-002',
        owner: 'John Smit',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
    {
        id: 'org-003',
        owner: 'John Doe',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
    {
        id: 'org-004',
        owner: 'John Smit',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
    {
        id: 'org-005',
        owner: 'GreenTech Solutions',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
    {
        id: 'org-006',
        owner: 'GreenTech Solutions',
        vehicle: "Toyota Camry (2022)",
        color: "Green",
        lastActivity: "2 hours ago",
        regNumber: "AAC-002-XY",
        status: 'Active',
    },
];


function RegisteredVehicle() {
    return (
        <Card className={"rounded mt-5 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Vehicle Registry</h1>
                    <p className={"text-sm pt-2"}>Vehicles are automatically approved and set to “Active” upon registration by an organization, provided they are within their vehicle slot limit.</p>
                </div>
                <Link href={"/org/vehicles/register"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Add Vehicle  <IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <RegisteredVehicleTable data={mockRevenue} onExport={() => { }} />
                </Suspense>
            </div>
        </Card>
    )
}

export default RegisteredVehicle
