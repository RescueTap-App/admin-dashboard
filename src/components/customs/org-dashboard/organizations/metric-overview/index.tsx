import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DriverListTypes } from "@/types/drivers.types"
import type { Organization } from "@/types/organization.types"
import { Car, QrCode, Users } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { CiExport } from "react-icons/ci"
import { IoIosArrowRoundForward } from "react-icons/io"
import { DriversListTable } from "../drivers/drivers-list/table"


interface DashboardOverviewProps {
    organization: Organization
    activities: DriverListTypes[]
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
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center relative">
                        <Image
                            src={organization?.profileImage || "/icons/org-icon.svg"}
                            alt={"Building Logo"}
                            fetchPriority="high"
                            height={50}
                            width={50}
                            className="object-contain object-center" />
                    </div>
                    <div className={"flex flex-col items-center"}>
                        <div className="font-semibold text-gray-900">{organization?.firstName} & {organization?.lastName}</div>
                        <div className="text-sm text-gray-500">{organization?.organizationName}</div>
                        <div className="text-sm text-gray-500">{organization?.email}</div>
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
                                10 of 100
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
                            <div className="text-2xl font-bold text-green-600">300</div>
                            <div className="text-sm text-gray-600">Active Visitors</div>
                            <div className="text-xs text-gray-500">Currently on Premises</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-purple-500/50 mx-auto flex items-center justify-center">
                                <QrCode className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            </div>
                            <div className="text-2xl font-bold text-purple-600">50</div>
                            <div className="text-sm text-gray-600">QR Stickers</div>
                            <div className="text-xs text-gray-500">Generated</div>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow">
                        <CardContent className="p-4 text-center">
                            <div className="rounded-full h-16 w-16 bg-orange-500/50 mx-auto flex items-center justify-center">
                                <Car className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            </div>

                            <div className="text-2xl font-bold text-orange-600">20</div>
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

                <Suspense>
                    <DriversListTable data={activities || []} />
                </Suspense>
            </div>
        </div>
    )
}
