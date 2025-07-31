"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useBlogs from "@/hooks/use-blogs"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { BlogListTable } from './table'


function BlogsList() {
    const { all_blogs } = useBlogs({ fetchAllBlogs: true })
    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Blogs List</h1>
                    <p className={"text-sm pt-2"}>All Blogs Here</p>
                </div>
                <div className={"flex flex-row items-center gap-3"}>
                    <Link href={"/dashboard/blogs/create"}>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Create Blog <IconPlus /></Button>
                    </Link>

                    <Link href={"/dashboard/blogs/category/create"}>
                        <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>Add Category <IconPlus /></Button>
                    </Link>
                </div>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <BlogListTable data={all_blogs || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default BlogsList
