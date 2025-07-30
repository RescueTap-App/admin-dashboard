"use client"

import * as React from "react"
import {
    Users,
    Car,
    Settings,
    UserCog2,
    IdCardIcon,
    LogOut
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavMain } from "./nav-main"

const data = {
    navMain: [
        {
            title: "Vehicles Registry",
            url: "#",
            icon: Car,
            isActive: true,
            items: [
                {
                    title: "All Vehicles",
                    url: "/org/vehicles",
                },
                {
                    title: "Register Vehicle",
                    url: "/org/vehicles/register",
                },
                {
                    title: "Request Slots",
                    url: "/org/vehicles/request-slot",
                },
            ],
        },
        {
            title: "Users Registry",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Drivers List",
                    url: "/org/drivers",
                },
                {
                    title: "Create Driver",
                    url: "/org/drivers/create",
                },
                {
                    title: "Bulk Registration",
                    url: "/org/bulk-registry/create",
                },
            ],
        },
        {
            title: "Visitors Registry",
            url: "#",
            icon: UserCog2,
            items: [
                {
                    title: "All Visitors",
                    url: "/org/visitors",
                },
                {
                    title: "Active Visitors",
                    url: "/org/visitors/active",
                },
                {
                    title: "Create Visitor",
                    url: "/org/visitors/generate-pass",
                },
            ],
        },
        {
            title: "Analytics",
            url: "#",
            icon: IdCardIcon,
            items: [
                {
                    title: "Your Analytics",
                    url: "/org/analytics",
                }
            ],
        },
        {
            title: "Settings",
            url: "/org/settigs",
            icon: Settings,
            // items: [
            //     {
            //         title: "Your Settings",
            //         url: "/org/settings",
            //     }
            // ],
        },
    ],
}

export function UserAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className={"relative h-10 w-full"}>
                    <Image
                        src={"/icons/logo-text.png"}
                        fill fetchPriority={"high"}
                        alt={"Rescue Tap Logoo"}
                        className={"object-contain object-center"} />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <button className="flex flex-row items-center justify-between py-2 px-1.5 font-lato">Logout <LogOut/></button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
