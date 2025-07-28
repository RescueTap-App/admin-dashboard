"use client"

import { Activity, Organization } from '@/types/organization.types'
import React from 'react'
import { DashboardOverview } from './metric-overview'
import { useRouter } from 'next/navigation'

const mockOrganization: Organization = {
    id: "1",
    name: "Brains & Hammers",
    type: "Residential",
    vehicleSlots: {
        used: 302,
        total: 350,
    },
    activeVisitors: 4,
    qrStickers: 317,
    vehiclePasses: 200,
}

const mockActivities: Activity[] = [
    {
        id: "1",
        type: "registration",
        description: "New vehicle registered - Toyota Camry (ABC-123-XY)",
        timestamp: "By John Doe • 2 hours ago",
        status: "completed",
        category: "Vehicle Registration",
    },
    {
        id: "2",
        type: "bulk_registration",
        description: "Bulk registration completed - 15 users added",
        timestamp: "By Admin • 1 day ago",
        status: "completed",
        category: "Bulk Registration",
    },
    {
        id: "3",
        type: "vehicle_add",
        description: "Vehicle slot recorded - BMW X5 (DEF-789-UV)",
        timestamp: "By Jane Smith • 2 days ago",
        status: "completed",
        category: "Vehicle Add",
    },
    {
        id: "4",
        type: "registration",
        description: "New vehicle registered - Honda Civic (GHI-456-QR)",
        timestamp: "By Mike Johnson • 3 days ago",
        status: "completed",
        category: "Vehicle Registration",
    },
]

function UserDashboardOverview() {
    const router = useRouter()
    return (
        <section>
            <DashboardOverview
                organization={mockOrganization}
                activities={mockActivities}
                onVehicleRegistry={() => { router.push('/org/vehicle-registry') }}
                onBulkRegistration={() => router.push("/org/bulk-registration")}
                onRequestSlots={() => router.push("/org/vehicles/request-slot")}
            />
        </section>
    )
}

export default UserDashboardOverview
