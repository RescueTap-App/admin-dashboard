import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link";

interface DashboardData {
    totalOrganizations: {
        count: number
        residential: number
        commercial: number
    }
    monthlyRevenue: {
        amount: string
        growth: string
    }
    vehicleSlots: {
        utilized: number
        allocated: number
    }
    analytics: {
        count: number
        operational: string
    }
}

export default function StatsCard({ data, activeTab }: { data: DashboardData, activeTab: string }) {

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Total Organizations */}
            <Link href={`?tab=organizations`}>
                <Card
                    className={`rounded cursor-pointer transition py-2 border shadow ${activeTab === 'organizations' ? ' border-[#C6C6C6] bg-transparent' : 'border-[#DDDDDD] bg-white'}`}
                >
                    <CardHeader className=" px-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-600">Total Organizations</CardTitle>
                        <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data.totalOrganizations.count}</h1>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="text-sm text-gray-500">
                            <span className="text-[#DDDDDD] bg-white">{data.totalOrganizations.residential} Residential</span>
                            <span className="mx-1">|</span>
                            <span className="text-green-600">{data.totalOrganizations.commercial} Commercial</span>
                        </div>
                    </CardContent>
                </Card>
            </Link>

            {/* Monthly Revenue */}
            <Link href={`?tab=revenue`}>
                <Card
                    className={`rounded cursor-pointer transition py-2 border shadow ${activeTab === 'revenue' ? ' border-[#C6C6C6] bg-transparent' : 'border-[#DDDDDD] bg-white'}`}
                >
                    <CardHeader className=" px-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-600">Total Revenue</CardTitle>
                        <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data.monthlyRevenue.amount}</h1>

                    </CardHeader>
                    <CardContent className="px-2 ">

                        <div className="text-sm text-green-600 font-medium">{data.monthlyRevenue.growth} from last month</div>
                    </CardContent>
                </Card>
            </Link>
            {/* Vehicle Slots Utilized */}
            <Link href={`?tab=vehicles`}>
                <Card
                    className={`rounded cursor-pointer transition py-2 border shadow ${activeTab === 'vehicles' ? ' border-[#C6C6C6] bg-transparent' : 'border-[#DDDDDD] bg-white'}`}
                >
                    <CardHeader className="px-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-600">Vehicle Slots Utilized</CardTitle>
                        <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data.vehicleSlots.utilized.toLocaleString()}</h1>
                    </CardHeader>
                    <CardContent className="px-2 ">
                        <div className="text-sm text-gray-500">
                            of {data.vehicleSlots.allocated.toLocaleString()} allocated slots
                        </div>
                    </CardContent>
                </Card>
            </Link>
            <Link href={`?tab=analytics`}>
                <Card
                    className={`rounded cursor-pointer transition py-2 border shadow ${activeTab === 'analytics' ? ' border-[#C6C6C6] bg-transparent' : 'border-[#DDDDDD] bg-white'}`}
                >
                    <CardHeader className=" px-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-600">Analytics & Insights</CardTitle>
                        <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data.vehicleSlots.utilized.toLocaleString()}</h1>
                    </CardHeader>
                    <CardContent className="px-2 font-lato">
                        <div className="text-sm text-gray-500">
                            Operational
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
