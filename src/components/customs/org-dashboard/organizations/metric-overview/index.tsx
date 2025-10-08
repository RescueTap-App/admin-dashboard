"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import type { Organization } from "@/types/organization.types"
import { Car, Users, UserCheck } from "lucide-react"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DashboardOverviewProps {
    organization: Organization
    drivers: number
    users: number
    visitors: number
}

export function DashboardOverview({
    organization,
    drivers,
    users,
    visitors
}: DashboardOverviewProps) {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="bg-card border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-6">
                        <div className="relative size-20 rounded-xl bg-gradient-to-br from-[#EF4136] to-primary/5 flex items-center justify-center ring-1 ring-border">
                            <Image
                                src={organization?.profileImage || "/icons/org-icon.svg"}
                                alt="Organization Logo"
                                fetchPriority="high"
                                height={56}
                                width={56}
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <div className="flex-1 font-lato">
                            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                                {organization?.firstName} {organization?.lastName}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">{organization?.organizationName}</p>
                            <p className="text-sm text-muted-foreground">{organization?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="border-border hover:shadow-sm transition-shadow font-lato">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Total Drivers</p>
                                        <p className="text-3xl font-bold text-foreground">{drivers}</p>
                                        <p className="text-xs text-muted-foreground">Registered drivers</p>
                                    </div>
                                    <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Car className="size-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:shadow-sm transition-shadow font-lato">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                        <p className="text-3xl font-bold text-foreground">{users}</p>
                                        <p className="text-xs text-muted-foreground">Active accounts</p>
                                    </div>
                                    <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                                        <Users className="size-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:shadow-sm transition-shadow font-lato">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                                        <p className="text-3xl font-bold text-foreground">{visitors}</p>
                                        <p className="text-xs text-muted-foreground">All-time visits</p>
                                    </div>
                                    <div className="size-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <UserCheck className="size-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                        <Item variant="outline" size="sm" asChild className="cursor-pointer transition-colors">
                            <Link href="/org/drivers">
                                <ItemMedia>
                                    <BadgeCheckIcon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Vehicle Registry</ItemTitle>
                                    <ItemDescription>View and manage all registered vehicles in the system</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <ChevronRightIcon className="size-4" />
                                </ItemActions>
                            </Link>
                        </Item>

                        <Item variant="outline" size="sm" asChild>
                            <Link href="/org/bulk-registry/create">
                                <ItemMedia>
                                    <BadgeCheckIcon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Bulk Registration</ItemTitle>
                                    <ItemDescription>Upload CSV files to register multiple vehicles at once</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <ChevronRightIcon className="size-4" />
                                </ItemActions>
                            </Link>
                        </Item>



                        <Item variant="outline" size="sm" asChild>
                            <Link href="/org/vehicles/request-slot">
                                <ItemMedia>
                                    <BadgeCheckIcon className="size-5" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle>Request More Slots</ItemTitle>
                                    <ItemDescription>Submit a request for additional vehicle registration slots</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <ChevronRightIcon className="size-4" />
                                </ItemActions>
                            </Link>
                        </Item>
                    </div>
                </section>
            </div>
        </div>
    )
}
