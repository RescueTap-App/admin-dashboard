"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { UsersListTable } from './table'
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"


function UsersList() {

    const { user } = useSelector((state: RootState) => state.auth);
    const inviterId = user?._id as string;
    const { orgUsers } = useOrganization({ fetchAllUsers: true, inviterId });

    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Users List</h1>
                    <p className={"text-sm pt-2"}>List of all registered Users</p>
                </div>
                <Link href={"/org/invite"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}><span className={"hidden lg:inline"}> Invite a user </span><IconPlus /></Button>
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
