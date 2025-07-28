"use client"

import { Button } from "@/components/ui/button"

interface VistorActionsProps {
    visitorId: string
}
export function VisitorsActions({ visitorId }: VistorActionsProps) {
    console.log(visitorId)
    return (
        <Button variant={"outline"} className="rounded border border-[#EF4136] font-lato">Check out</Button>
    )
}
