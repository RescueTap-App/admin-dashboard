"use client"

import { Card, CardHeader } from '@/components/ui/card'
import React, { Suspense } from 'react'
import { VehicleRegistryTable } from './table'
import { VehicleRegistryTypes } from '@/types/organization.types'

const mockRevenue: VehicleRegistryTypes[] = [
    {
        id: 'org-001',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Residential",
        regNumber: "DEF-456-ZW",
        status: 'Expired',
    },
    {
        id: 'org-002',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Commercial",
        regNumber: "DEF-456-ZW",
        status: 'Active',
    },
    {
        id: 'org-003',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Residential",
        regNumber: "DEF-456-ZW",
        status: 'Expired',
    },
    {
        id: 'org-004',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Residential",
        regNumber: "DEF-456-ZW",
        status: 'Active',
    },
    {
        id: 'org-005',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Commercial",
        regNumber: "DEF-456-ZW",
        status: 'Active',
    },
    {
        id: 'org-006',
        organization: 'GreenTech Solutions',
        driverInfo: "John Doe",
        vehicleModel: "Toyota Camry",
        type: "Residential",
        regNumber: "DEF-456-ZW",
        status: 'Expired',
    },
];

function VehicleRegistry() {
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Vehicle Registry</h1>
                    <p className={"text-sm pt-2"}>Vehicles are automatically approved and set to “Active” upon registration by an organization, provided they are within their vehicle slot limit.</p>
                </div>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <VehicleRegistryTable data={mockRevenue} onExport={() => { }} />
                </Suspense>
            </div>
        </Card>
    )
}

export default VehicleRegistry
