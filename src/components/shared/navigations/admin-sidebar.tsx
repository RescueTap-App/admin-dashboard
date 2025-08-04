"use client"

import * as React from "react"
import {
    Boxes,
    Car,
    Users,
    BookAudioIcon,
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
            title: "Organizations",
            url: "#",
            icon: Boxes,
            isActive: true,
            items: [
                {
                    title: "All Organizations",
                    url: "/dashboard/organizations",
                },
                {
                    title: "Create Organizations",
                    url: "/dashboard/organizations/create",
                },
                {
                    title: "Active Organizations",
                    url: "/dashboard/organizations/active",
                },
                {
                    title: "Total Revenue",
                    url: "/dashboard/organizations/total-rev",
                },
                    {
                    title: "Vehicle Slots",
                    url: "/dashboard/organizations/vehicle-slots",
                },

            ],
        },
        {
            title: "Drivers Mgt",
            url: "#",
            icon:Car,
            items: [
                {
                    title: "Drivers List",
                    url: "/dashboard/drivers",
                },
                {
                    title: "Create Driver",
                    url: "/dashboard/drivers/create",
                },
            ],
        },
        {
            title: "Users Mgt",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Users List",
                    url: "/dashboard/users",
                },
                {
                    title: "Create User",
                    url: "/dashboard/users/create",
                },
            ],
        },
        {
            title: "Blog Mgt",
            url: "#",
            icon: BookAudioIcon,
            items: [
                {
                    title: "Blogs",
                    url: "/dashboard/blogs",
                },
                {
                    title: "Create Blog",
                    url: "/dashboard/blogs/create",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
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
                  <button className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-300 rounded py-2 px-1.5 font-lato">Logout <LogOut/></button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
