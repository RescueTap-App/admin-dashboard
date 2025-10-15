import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
    totalOrganizations: number
    orgPercentChange: number
    totalIndividuals: number
    individualPercentChange: number
    totalRevenue: number
    revenuePercentChange: number
}

export default function StatsCard({ data }: { data: DashboardData }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (percent: number) => {
        const sign = percent >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(1)}%`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Total Organizations */}
            <Card className="rounded py-2 border shadow-none border-[#DDDDDD] bg-white">
                <CardHeader className="px-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-600">Total Organizations</CardTitle>
                    <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data?.totalOrganizations || 0}</h1>
                </CardHeader>
                <CardContent className="px-2">
                    <div className="text-sm text-green-600 font-medium">
                        {formatPercentage(data?.orgPercentChange || 0)} from last period
                    </div>
                </CardContent>
            </Card>

            {/* Total Individuals */}
            <Card className="rounded py-2 border shadow-none border-[#DDDDDD] bg-white">
                <CardHeader className="px-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-600">Total Individuals</CardTitle>
                    <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data?.totalIndividuals.toLocaleString() || 0}</h1>
                </CardHeader>
                <CardContent className="px-2">
                    <div className="text-sm text-green-600 font-medium">
                        {formatPercentage(data?.individualPercentChange || 0)} from last period
                    </div>
                </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card className="rounded py-2 border shadow-none border-[#DDDDDD] bg-white">
                <CardHeader className="px-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-600">Total Revenue</CardTitle>
                    <h1 className="text-lg font-medium font-roboto text-gray-900 mb-2">{formatCurrency(data?.totalRevenue || 0)}</h1>
                </CardHeader>
                <CardContent className="px-2">
                    <div className="text-sm text-green-600 font-medium">
                        {formatPercentage(data?.revenuePercentChange || 0)} from last period
                    </div>
                </CardContent>
            </Card>

            {/* Analytics Summary */}
            <Card className="rounded py-2 border shadow-none border-[#DDDDDD] bg-white">
                <CardHeader className="px-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-gray-600">Individuals Percentage</CardTitle>
                    <h1 className="text-xl font-semibold font-roboto text-gray-900 mb-2">{data?.individualPercentChange || 0}</h1>
                </CardHeader>
            </Card>
        </div>
    )
}
