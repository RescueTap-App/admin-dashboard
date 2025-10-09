"use client"

import useOrganization from "@/hooks/use-organization"
import useVisitors from "@/hooks/use-visitors"
import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'
import { DashboardOverview } from './metric-overview'

function UserDashboardOverview() {
    const { user } = useSelector((state: RootState) => state.auth);
    const orgId = user?._id as string;
    const { singleOrganization, orgDrivers } = useOrganization({ fetchAllOrgs: true, fetchAllUsers: true, inviterId: orgId, orgId });
    const { visitor } = useVisitors({ fetchVisitor: true, orgId: orgId })
    const inviterId = user?._id as string;
    const { orgUsers } = useOrganization({ fetchAllUsers: true, inviterId });

    return (
        <div>
            <DashboardOverview
                drivers={orgDrivers?.length || 0}
                users={orgUsers?.length || 0}
                visitors={visitor?.stats.totalVisits || 0}
                organization={singleOrganization}
            />
        </div>
    )
}

export default UserDashboardOverview
