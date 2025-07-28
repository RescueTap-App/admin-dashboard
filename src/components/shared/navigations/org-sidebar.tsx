"use client"

import * as React from "react"
import {
    Boxes,
    Car
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
            icon: Boxes,
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
            icon: Car,
            items: [
                {
                    title: "Drivers List",
                    url: "/org/drivers/create",
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
            icon: Car,
            items: [
                {
                    title: "Drivers List",
                    url: "/org/visitors/create",
                },
                {
                    title: "Create Driver",
                    url: "/org/visitors/create",
                },
            ],
        },
        {
            title: "Analytics",
            url: "#",
            icon: Car,
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
            icon: Car,
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
                <button>Logout</button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
