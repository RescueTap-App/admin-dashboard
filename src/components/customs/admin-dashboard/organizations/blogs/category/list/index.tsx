"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import useBlogs from "@/hooks/use-blogs"
import { IconPlus } from '@tabler/icons-react'
import { Suspense } from 'react'
import CreateCategory from "../create"
import { CategoryTable } from './table'

function CategoryList() {

    const { all_categories } = useBlogs({ fetchAllCategories: true });

    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Category List</h1>
                    <p className={"text-sm pt-2"}>List of all Created Category</p>
                </div>

                <Drawer>
                    <DrawerTrigger>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                            <span className="hidden lg:inline">Create New Category</span>
                            <IconPlus />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-w-lg mx-auto">
                        <DrawerTitle className="sr-only">Create Category</DrawerTitle>
                        <CreateCategory />
                    </DrawerContent>
                </Drawer>

            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <CategoryTable data={all_categories || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default CategoryList
