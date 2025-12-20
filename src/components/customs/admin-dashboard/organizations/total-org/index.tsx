"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"
import useOrganization from "@/hooks/use-organization"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Fragment, Suspense } from 'react'
import { TotalOrganizationTable } from './table'
import StatsCard from "../stats-card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function StatsCardSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded py-2 border shadow-none border-[#DDDDDD] bg-white">
                    <CardHeader className="px-2 flex flex-row items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-16" />
                    </CardHeader>
                    <CardContent className="px-2">
                        <Skeleton className="h-4 w-40" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="overflow-hidden border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        <TableRow>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cell) => (
                                    <TableCell key={cell}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4 pt-3">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}

function Oraganizations() {
    const { organizations, analytics, loadingOrganizations, loadingAnalytics } = useOrganization({ fetchAllOrgs: true })

    return (
        <Fragment>
            {loadingAnalytics ? (
                <StatsCardSkeleton />
            ) : (
                <StatsCard data={analytics} />
            )}
            <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
                <CardHeader className='flex flex-row justify-between px-0'>
                    <div>
                        <h1 className={"font-semibold text-xl"}>Organization List</h1>
                        <p className={"text-sm pt-2"}>List of all Organization</p>
                    </div>
                    <Link href={"/dashboard/organizations/create"} passHref>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className="hidden lg:inline">Create New Organization</span>
                            <IconPlus />
                        </Button>
                    </Link>
                </CardHeader>
                <div className='overflow-x-auto md:max-w-md min-w-full'>
                    {loadingOrganizations ? (
                        <TableSkeleton />
                    ) : (
                        <Suspense>
                            <TotalOrganizationTable data={organizations?.data || []} />
                        </Suspense>
                    )}
                </div>
            </Card>
        </Fragment>
    )
}

export default Oraganizations
