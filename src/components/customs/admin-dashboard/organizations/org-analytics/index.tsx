"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"


interface DashboardData {
    organizationalHealth: {
        activeOrganizations: number
        orgsNearingCapacity: number
        avgVehiclePerOrg: number
        inactiveOrg: number
    }
    businessMetrics: {
        monthlyRecurringRevenue: string
        subscriptionRenewalRate: string
        averageRevenuePerEstate: string
        tierConversionRate: string
    }
    performanceRanking: Array<{
        id: number
        name: string
        type: "Residential" | "Commercial"
        score: number
        total: number
    }>
}

const defaultData: DashboardData = {
    organizationalHealth: {
        activeOrganizations: 2,
        orgsNearingCapacity: 2,
        avgVehiclePerOrg: 575,
        inactiveOrg: 1,
    },
    businessMetrics: {
        monthlyRecurringRevenue: "₦668k",
        subscriptionRenewalRate: "92%",
        averageRevenuePerEstate: "2.01M",
        tierConversionRate: "25%",
    },
    performanceRanking: [
        {
            id: 1,
            name: "Brains & Hammers Estate",
            type: "Residential",
            score: 890,
            total: 1000,
        },
        {
            id: 2,
            name: "University of Lagos",
            type: "Commercial",
            score: 523,
            total: 600,
        },
        {
            id: 3,
            name: "Shoprite Mall",
            type: "Commercial",
            score: 312,
            total: 400,
        },
    ],
}

export default function OrganizationAnalytics({ data = defaultData }: { data?: DashboardData }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 days")

    const filteredRanking = data.performanceRanking.filter((org) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="max-w-full mx-auto space-y-6 flex flex-col gap-4 mt-5">
            {/* Analytics & Insights Section */}
            <Card className="bg-white rounded shadow font-lato">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Analytics & Insights</CardTitle>
                    <p className="text-sm text-gray-600">See a summary of all organizations performance rankings.</p>
                </CardHeader>
                <CardContent className="px-2">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Categories">All Categories</SelectItem>
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                                <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                                <SelectItem value="Last year">Last year</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Export Registry
                        </Button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Organizational Health */}
                        <div className="border p-2">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">Organizational Health</h3>
                            <p className="text-sm text-gray-600 mb-4">Status and capacity management across organizations</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-1">
                                        {data.organizationalHealth.activeOrganizations}
                                    </div>
                                    <div className="text-sm text-gray-600">Active Organizations</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {data.organizationalHealth.orgsNearingCapacity}
                                    </div>
                                    <div className="text-sm text-gray-600">Orgs Nearing Capacity</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-1">
                                        {data.organizationalHealth.avgVehiclePerOrg}
                                    </div>
                                    <div className="text-sm text-gray-600">Avg Vehicle/Org</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-1">
                                        {data.organizationalHealth.inactiveOrg}
                                    </div>
                                    <div className="text-sm text-gray-600">Inactive Org</div>
                                </div>
                            </div>
                        </div>

                        {/* Business Metrics */}
                        <div className="border p-2">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">Business Metrics</h3>
                            <p className="text-sm text-gray-600 mb-4">Revenue and growth performance indicators</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-1">
                                        {data.businessMetrics.monthlyRecurringRevenue}
                                    </div>
                                    <div className="text-sm text-gray-600">Monthly Recurring Revenue</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {data.businessMetrics.subscriptionRenewalRate}
                                    </div>
                                    <div className="text-sm text-gray-600">subscription Renewal Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-pink-600 mb-1">
                                        {data.businessMetrics.averageRevenuePerEstate}
                                    </div>
                                    <div className="text-sm text-gray-600">Average Revenue Per Estate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-1">
                                        {data.businessMetrics.tierConversionRate}
                                    </div>
                                    <div className="text-sm text-gray-600">Tier Conversion Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Organization Performance Ranking */}
            <Card className="bg-white rounded shadow font-lato">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Organization Performance Ranking</CardTitle>
                    <p className="text-sm text-gray-600">Estates ranked by revenue and vehicle adoption</p>
                </CardHeader>
                <CardContent className="px-2">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search estates"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Categories">All Categories</SelectItem>
                                <SelectItem value="Residential">Residential</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ranking List */}
                    <div className="space-y-3">
                        {filteredRanking.map((org, index) => (
                            <div
                                key={org.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${index === 0 ? "bg-green-500" : index === 1 ? "bg-orange-500" : "bg-gray-500"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{org.name}</div>
                                        <Badge variant="secondary" className="text-xs">
                                            {org.type}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-gray-900">
                                        {org.score}/{org.total}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
