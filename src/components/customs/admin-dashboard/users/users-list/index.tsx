"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useUsers from "@/hooks/use-users"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { UsersListTable } from './table'


function UsersList() {
    const { all_users } = useUsers({ fetchAllUsers: true })
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Users List</h1>
                    <p className={"text-sm pt-2"}>List of all registered Users</p>
                </div>
                <Link href={"/dashboard/users/create"}>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Create New User <IconPlus /></Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <UsersListTable data={all_users || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default UsersList
