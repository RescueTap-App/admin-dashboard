"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import useBlogs from "@/hooks/use-blogs"
import { IconPlus } from '@tabler/icons-react'
import { Suspense } from 'react'
import CreateCategory from "../create"
import { CategoryTable } from './table'
import { useState } from "react"
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
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
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

function CategoryList() {

    const [open, setOpen] = useState(false)
    const { all_categories, loadingCategories } = useBlogs({ fetchAllCategories: true });

    return (
        <Card className={"rounded-sm  px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Category List</h1>
                    <p className={"text-sm pt-2"}>List of all Created Category</p>
                </div>

                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className="hidden lg:inline">Create New Category</span>
                            <IconPlus />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-w-lg mx-auto">
                        <DrawerTitle className="sr-only">Create Category</DrawerTitle>
                        <CreateCategory setOpen={setOpen} />
                    </DrawerContent>
                </Drawer>

            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                {loadingCategories ? (
                    <TableSkeleton />
                ) : (
                    <Suspense>
                        <CategoryTable data={all_categories || []} />
                    </Suspense>
                )}
            </div>
        </Card>
    )
}

export default CategoryList
