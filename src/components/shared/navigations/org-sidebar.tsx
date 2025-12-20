"use client"

import * as React from "react"
import {
    Users,
    Car,
    LogOut,
    AlertTriangle
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { NavMain } from "./nav-main"
import { useAuth } from "@/hooks/use-auth"
import { MdOutlineEngineering } from "react-icons/md";
import Link from "next/link"


const data = {
    navMain: [
        {
            title: "Vehicles Registry",
            url: "#",
            icon: Car,
            isActive: true,
            items: [
                {
                    title: "Request Slots",
                    url: "/org/vehicles/request-slot",
                },
                {
                    title: "Drivers List",
                    url: "/org/drivers",
                },
                {
                    title: "Create Driver",
                    url: "/org/drivers/create",
                },
            ],
        },
        {
            title: "Users Registry",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Users List",
                    url: "/org/users",
                },
                {
                    title: "Invite User",
                    url: "/org/invite",
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
            icon: MdOutlineEngineering,
            items: [
                {
                    title: "All Visitors",
                    url: "/org/visitors",
                },
                {
                    title: "Verify Visitor",
                    url: "/org/visitors/verify",
                },
                {
                    title: "Invite Visitor",
                    url: "/org/visitors/generate-pass",
                },
            ],
        },
        {
            title: "Emergencies",
            url: "#",
            icon: AlertTriangle,
            items: [
                {
                    title: "All Emergencies",
                    url: "/org/emergencies",
                }
            ],
        },
    ],
}

export function UserAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { logOut } = useAuth();
    const { open } = useSidebar()
    return (
        <Sidebar collapsible="icon"  {...props}>
            <SidebarHeader>
                {open ?
                    <Link href={""}>
                        <div className={"relative h-10 w-full"}>
                            <Image
                                src={"/icons/logo-text.png"}
                                fill fetchPriority={"high"}
                                alt={"Rescue Tap Logoo"}
                                className={"object-contain object-center"} />
                        </div>
                    </Link>
                    : <Link href={""}>
                        <div className='h-10 relative w-10 mr-2'>
                            <Image
                                src={"/icons/logo-icon.png"}
                                fill fetchPriority="high"
                                alt={"Logo"}
                                className={"object-contain"}
                            />
                        </div>
                    </Link>}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <button onClick={logOut} className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-300 rounded py-2 px-1.5 font-lato">Logout <LogOut /></button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

