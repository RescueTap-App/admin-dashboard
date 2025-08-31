"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation";
//comment

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const pathname = usePathname();
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname.startsWith(item.url);
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title} className={"py-5"}>
                                        {item.icon && (
                                            <span className={`text-2xl xl:text-2xl 2xl:text-3xl  ${isActive
                                                ? "text-[#EF4136] active:bg-gray-900"
                                                : "text-gray-700"}`}>
                                                <item.icon />
                                            </span>
                                        )}
                                        <span className={`text-sm 2xl:text-xl font-roboto font-light ${isActive && "text-[#EF4136]"}`}>
                                            {item.title}
                                        </span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const isSubActive = pathname === subItem.url;
                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={subItem.url}>
                                                            <span className={`font-lato ${isSubActive ? "text-[#EF4136] font-semibold" : ""}`}>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}

            </SidebarMenu>
        </SidebarGroup>
    )
}
