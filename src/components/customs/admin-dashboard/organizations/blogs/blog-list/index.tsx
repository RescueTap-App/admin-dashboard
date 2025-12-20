"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"
import useBlogs from "@/hooks/use-blogs"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { BlogListTable } from './table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cell) => (
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

function BlogsList() {
    const { all_blogs, loadingBlogs } = useBlogs({ fetchAllBlogs: true })
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Blogs List</h1>
                    <p className={"text-sm pt-2"}>All Blogs Here</p>
                </div>
                <div className={"flex flex-row items-center gap-3"}>
                    <Link href={"/dashboard/blogs/create"}>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className={"hidden lg:inline"}>Create Blog </span>
                            <IconPlus /></Button>
                    </Link>

                    <Link href={"/dashboard/blogs/category"}>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className={"hidden lg:inline"}>Blog Categories</span>
                            <IconPlus /></Button>
                    </Link>
                </div>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                {loadingBlogs ? (
                    <TableSkeleton />
                ) : (
                    <Suspense>
                        <BlogListTable data={all_blogs || []} />
                    </Suspense>
                )}
            </div>
        </Card>
    )
}

export default BlogsList
