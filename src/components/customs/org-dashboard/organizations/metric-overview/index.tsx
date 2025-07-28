import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, QrCode, Car } from "lucide-react"
import type { Organization, Activity } from "@/types/organization.types"
import { CiExport } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";


interface DashboardOverviewProps {
    organization: Organization
    activities: Activity[]
    onVehicleRegistry: () => void
    onBulkRegistration: () => void
    onRequestSlots: () => void
}

export function DashboardOverview({
    organization,
    activities,
    onVehicleRegistry,
    onBulkRegistration,
    onRequestSlots,
}: DashboardOverviewProps) {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="bg-white p-4 mb-4">
                <div className="flex items-center justify-center flex-col gap-3 mb-4 mx-auto">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className={"flex flex-col items-center"}>
                        <div className="font-semibold text-gray-900">{organization.name}</div>
                        <div className="text-sm text-gray-500">{organization.type} Estate - Apo, Abuja</div>
                    </div>
                </div>

                <div className="text-lg font-semibold mb-4 text-center">Overview</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-blue-500/50 mx-auto flex items-center justify-center">
                                <Car className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {organization.vehicleSlots.used} of {organization.vehicleSlots.total}
                            </div>
                            <div className="text-sm text-gray-600">Vehicle Slots</div>
                            <div className="text-xs text-gray-500">48 slots left</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-green-500/50 mx-auto flex items-center justify-center">
                                <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            </div>
                            <div className="text-2xl font-bold text-green-600">{organization.activeVisitors}</div>
                            <div className="text-sm text-gray-600">Active Visitors</div>
                            <div className="text-xs text-gray-500">Currently on Premises</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-purple-500/50 mx-auto flex items-center justify-center">
                                <QrCode className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            </div>
                            <div className="text-2xl font-bold text-purple-600">{organization.qrStickers}</div>
                            <div className="text-sm text-gray-600">QR Stickers</div>
                            <div className="text-xs text-gray-500">Generated</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-orange-500/50 mx-auto flex items-center justify-center">
                                <Car className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            </div>

                            <div className="text-2xl font-bold text-orange-600">{organization.vehiclePasses}</div>
                            <div className="text-sm text-gray-600">Vehicle Passes</div>
                            <div className="text-xs text-gray-500">In Total</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-white p-4 mb-4">
                <div className="text-lg font-semibold mb-4">Available Actions</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    <Card className="cursor-pointer rounded font-roboto hover:bg-gray-50 border border-[#EF41364D]" onClick={onVehicleRegistry}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Vehicle Registry</div>
                                    <div className="text-sm text-gray-500">See all registered vehicles and upload new ones</div>
                                </div>
                                <IoIosArrowRoundForward className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer rounded font-roboto hover:bg-gray-50 border border-[#EF41364D]" onClick={onBulkRegistration}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Bulk Registration</div>
                                    <div className="text-sm text-gray-500">Upload CSV file to register multiple vehicles</div>
                                </div>
                                <IoIosArrowRoundForward className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer rounded font-roboto hover:bg-gray-50 border border-[#EF41364D]" onClick={onRequestSlots}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Request More Slots</div>
                                    <div className="text-sm text-gray-500">Request additional vehicle slots from admin</div>
                                </div>
                                <IoIosArrowRoundForward className="w-5 h-5 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">Recent Activity</div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">This Week</span>
                        <Button variant="outline" size="sm" className={"rounded font-lato"}>
                            Export
                            <CiExport />
                        </Button>
                    </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">Latest activities in your organization</div>

                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between py-2 border rounded px-2">
                            <div className="flex items-center gap-2">
                                <div className={"bg-green-600 rounded-full h-3 w-3"} />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{activity.description}</div>
                                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {activity.category}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
