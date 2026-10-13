"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { UsersListTable } from './table'
import { OrgUsersSkeleton } from './skeleton'
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import useUsers from "@/hooks/use-users"

function UsersList() {

    const { user } = useSelector((state: RootState) => state.auth);
    const inviterId = user?._id as string;
    const { orgUsers, loadingOrgUsers } = useOrganization({ fetchAllUsers: true, inviterId });
    const { activeSubscription } = useUsers({ fetchAllUsers: true, userId: inviterId })
    const userLimit = typeof activeSubscription?.userLimit === "number" ? activeSubscription.userLimit : undefined
    const usedSlots = Array.isArray(orgUsers) ? orgUsers.length : 0
    const noAvailableSlots = userLimit !== undefined && usedSlots >= userLimit

    // Show skeleton loader while loading
    if (loadingOrgUsers) {
        return <OrgUsersSkeleton />
    }

    return (
        <Card className={"rounded-sm  px-3 min-w-full shadow"}>
            {/* {JSON.stringify(orgUsers?.[0])} */}
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Users List</h1>
                    <p className={"text-sm pt-2"}>List of all registered Users</p>
                    {userLimit !== undefined && (
                        <p className="pt-1 text-sm text-muted-foreground">
                            {usedSlots} of {userLimit} user slots in use
                        </p>
                    )}
                </div>
                <Link href={"/org/invite"}>
                    <Button disabled={noAvailableSlots} className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}><span className={"hidden lg:inline"}>{noAvailableSlots ? "No slots available" : "Invite a user"} </span><IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <UsersListTable data={orgUsers || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default UsersList
