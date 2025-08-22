"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from '@/components/ui/card'
import useBlogs from "@/hooks/use-blogs"
import { IconPlus } from '@tabler/icons-react'
import Link from "next/link"
import { Suspense } from 'react'
import { TipsListTable } from './table'

function TipsPage() {
    
    const { tips } = useBlogs({ fetchAllTips: true });

    return (
        <Card className={"rounded-sm mt-10 px-3 min-w-full shadow"}>
            <CardHeader className='flex flex-row justify-between px-0'>
                <div>
                    <h1 className={"font-semibold text-xl"}>Tip List</h1>
                    <p className={"text-sm pt-2"}>List of all Created Tips on Rescue Tap</p>
                </div>
                <Link href={"/dashboard/blogs/tips/create"} passHref>
                    <Button className={"bg-[#EF4136] hover:bg-[#EF4136]/50 rounded"}>
                        <span className="hidden lg:inline">Create new tip</span>
                        <IconPlus />
                    </Button>
                </Link>
            </CardHeader>
            <div className='overflow-x-auto md:max-w-md min-w-full'>
                <Suspense>
                    <TipsListTable data={tips || []} />
                </Suspense>
            </div>
        </Card>
    )
}

export default TipsPage
