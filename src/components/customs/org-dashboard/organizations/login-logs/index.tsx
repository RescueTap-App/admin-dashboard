"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { RootState } from "@/lib/store"
import { useGetOrganizationLoginLogsQuery } from "@/redux/features/organization-login-logs-api"
import { useState } from "react"
import { useSelector } from "react-redux"

function displayUser(userId: string | { firstName?: string; lastName?: string; email?: string } | undefined) {
    if (!userId || typeof userId === "string") return "Organization member"
    return `${userId.firstName || ""} ${userId.lastName || ""}`.trim() || userId.email || "Organization member"
}

export default function OrganizationLoginLogs() {
    const { user } = useSelector((state: RootState) => state.auth)
    const organizationId = user?._id as string | undefined
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const { data: logs = [], isLoading, isError } = useGetOrganizationLoginLogsQuery(
        { organizationId: organizationId!, from: from || undefined, to: to || undefined },
        { skip: !organizationId },
    )

    return (
        <section className="space-y-5">
            <div>
                <h1 className="text-xl font-semibold">Login Activity</h1>
                <p className="text-sm text-muted-foreground">Recent sign-ins for your organization members.</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <label className="grid gap-1 text-sm font-medium">From<Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
                <label className="grid gap-1 text-sm font-medium">To<Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
            </div>
            <Card className="rounded-sm shadow">
                <CardHeader><CardTitle>Sign-ins</CardTitle></CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-32 w-full" /> : isError ? <p className="text-sm text-destructive">Unable to load login activity.</p> : (
                        <div className="divide-y">
                            {logs.map((log) => (
                                <div key={log._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                                    <span className="font-medium">{displayUser(log.userId)}</span>
                                    <span className="text-muted-foreground">{new Date(log.loggedInAt || log.createdAt || 0).toLocaleString()}</span>
                                    <span className="text-muted-foreground">{log.deviceType || "Unknown device"}</span>
                                </div>
                            ))}
                            {!logs.length && <p className="py-4 text-sm text-muted-foreground">No login activity for this period.</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    )
}