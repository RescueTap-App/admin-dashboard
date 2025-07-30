'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserAppSidebar } from "@/components/shared/navigations/org-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from 'react';

export default function RootOrgNavigationLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Split the current path into segments, filtering out empty strings
    const pathSegments = pathname.split('/').filter(Boolean);

    // Create a cumulative path for each breadcrumb level
    const breadcrumbPaths = pathSegments.map((segment, index) => ({
        name: decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1)),
        href: '/' + pathSegments.slice(0, index + 1).join('/')
    }));

    return (
        <SidebarProvider>
            <UserAppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {breadcrumbPaths.map((item, idx) => (
                                    <React.Fragment key={item.href}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            {idx === breadcrumbPaths.length - 1 ? (
                                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>{item.name}</Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 px-4 py-10 bg-[#F4F6F9]">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
