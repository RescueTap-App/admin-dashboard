"use client"

import React from 'react'
import { DashboardOverview } from './metric-overview'
import { useRouter } from 'next/navigation'
import useOrganization from "@/hooks/use-organization"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'


function UserDashboardOverview() {
    const { user } = useSelector((state: RootState) => state.auth);
    const orgId = user?._id as string;
    const { singleOrganization, orgDrivers } = useOrganization({ fetchAllOrgs: true, fetchAllUsers: true, inviterId: orgId, orgId });
    const router = useRouter();

    return (
        <section>
            <DashboardOverview
                organization={singleOrganization}
                activities={orgDrivers || []}
                onVehicleRegistry={() => { router.push('/org/vehicles/registry') }}
                onBulkRegistration={() => router.push("/org/bulk-registry/create")}
                onRequestSlots={() => router.push("/org/vehicles/request-slot")}
            />
        </section>
    )
}

export default UserDashboardOverview
