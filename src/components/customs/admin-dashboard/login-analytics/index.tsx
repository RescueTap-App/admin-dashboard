"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import useUserSessions from "@/hooks/use-user-sessions"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconUsers } from "@tabler/icons-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts"

export function UserLoginAnalytics() {
    const { userSessionsStats, loadingUserSessions } = useUserSessions({
        fetchUserSessions: true,
    })

    if (loadingUserSessions) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </CardContent>
            </Card>
        )
    }

    const seatsUsagePercent = userSessionsStats.seatsAllocated
        ? Math.round(
            (userSessionsStats.seatsUsed / userSessionsStats.seatsAllocated) * 100
        )
        : 0

    const closingPercentage = 100 - seatsUsagePercent

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>User Login Analytics</CardTitle>
                    <CardDescription>
                        Organization subscription seat usage and login statistics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Logins */}
                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Total Logins (Month)
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {userSessionsStats.totalLogins}
                                    </p>
                                </div>
                                {/* <IconTrendingUp className="size-5 text-blue-500" /> */}
                            </div>
                        </div>

                        {/* Daily Active Users */}
                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Daily Active Users
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {userSessionsStats.dailyActiveUsers}
                                    </p>
                                </div>
                                {/* <IconUsers className="size-5 text-green-500" /> */}
                            </div>
                        </div>

                        {/* Seats Used */}
                        <div className="rounded-lg border bg-card p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Seats Used
                                    </p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {userSessionsStats.seatsUsed} /{" "}
                                        {userSessionsStats.seatsAllocated}
                                    </p>
                                    <Badge className="mt-2" variant={seatsUsagePercent > 90 ? "destructive" : "secondary"}>
                                        {seatsUsagePercent}% Used
                                    </Badge>
                                </div>
                                {/* <IconSession className="size-5 text-orange-500" /> */}
                            </div>
                        </div>

                        {/* Peak Login Time */}
                        <div className="rounded-lg border bg-card p-4">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">
                                    Peak Login Time
                                </p>
                                <p className="mt-2 text-2xl font-bold">
                                    {userSessionsStats.peakLoginTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Login Trend Chart */}
            {userSessionsStats.loginTrend && userSessionsStats.loginTrend.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Login Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userSessionsStats.loginTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#EF4136"
                                        strokeWidth={2}
                                        dot={{ fill: "#EF4136", r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Organizations */}
            {userSessionsStats.topOrganizations &&
                userSessionsStats.topOrganizations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Top Organizations by Logins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {userSessionsStats.topOrganizations.slice(0, 5).map((org) => (
                                    <div key={org.organization_id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium">{org.organizationName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {org.daily_active_users} active users
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{org.total_logins}</p>
                                            <p className="text-xs text-muted-foreground">logins</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
        </div>
    )
}
