"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import useDrivers from "@/hooks/use-drivers"
import { formatNumber } from "@/lib/utils"

interface DriverDetailProps {
    driverId: string
}

export default function DriverDetail({ driverId }: DriverDetailProps) {
    const { driver, loadingDriver } = useDrivers({ fetchADriver: true, driverId })

    if (loadingDriver) return <p className="text-center py-10">Loading...</p>

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">{driver?.driverName}</h1>
                        <p className="text-sm text-muted-foreground">{driver?.emailAddress}</p>
                    </div>
                    <Badge
                        className={`mt-2 md:mt-0 ${driver?.status.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                    >
                        {driver?.status}
                    </Badge>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className={"rounded shadow"}>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image
                                src={driver?.profileImage}
                                alt="Profile"
                                width={500}
                                height={500}
                                className="rounded w-full h-72 object-contain"
                            />
                        </CardContent>
                    </Card>
                    <Card className={"rounded shadow"}>
                        <CardHeader>
                            <CardTitle>Vehicle Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image
                                src={driver?.vehicleImage}
                                alt="Vehicle"
                                width={500}
                                height={500}
                                className="rounded w-full h-72 object-contain"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Driver Info */}
                <Card className={"rounded shadow"}>
                    <CardHeader>
                        <CardTitle>Driver Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <DetailItem label="First Name" value={driver?.firstName} />
                            <DetailItem label="Last Name" value={driver?.lastName} />
                            <DetailItem label="Email" value={driver?.email} />
                            <DetailItem label="Driver ID" value={"#" + driver?._id} />
                            <DetailItem label="Plate Number" value={driver?.plateNumber} />
                            <DetailItem label="Home Address" value={driver?.address} />
                            <DetailItem label="Emergency Contact" value={driver?.phoneNumber} />
                            <DetailItem
                                label="Terms Agreed"
                                value={driver?.termsAndConditionsAgreement ? "Yes" : "No"}
                            />
                            <DetailItem
                                label="Privacy Consent"
                                value={driver?.privacyConsent ? "Yes" : "No"}
                            />
                            <DetailItem
                                label="Number of Trips"
                                value={formatNumber(driver?.numberOfTrips)}
                            />
                            <DetailItem
                                label="Registered On"
                                value={format(new Date(driver?.registrationDate), "PPP")}
                            />
                            <DetailItem
                                label="Account Created"
                                value={format(new Date(driver?.createdAt), "PPP")}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Vehicle Info */}
                <Card className={"rounded shadow"}>
                    <CardHeader>
                        <CardTitle>Vehicle Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <DetailItem label="Vehicle" value={driver?.vehicle} />
                            <DetailItem label="Make" value={driver?.vehicleMake} />
                            <DetailItem label="Model" value={driver?.vehicleModel} />
                            <DetailItem label="Type" value={driver?.driverType} />
                            <DetailItem label="Insurance Info" value={driver?.insuranceInformation} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-black break-words">{value}</span>
        </div>
    )
}
