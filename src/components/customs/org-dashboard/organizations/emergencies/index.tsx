"use client"
import { Card, CardTitle } from "@/components/ui/card";
import { EmergenciesTabs } from "./manage/tabs";
import { useSearchParams } from "next/navigation";
import { EmergenciesTabContent } from "./manage/tabs/tab-content";
import { useGetEmergenciesQuery } from "@/redux/features/organization-api";
import { useMemo } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useEmergencyLivePositions } from "@/hooks/use-emergency-live-positions";

interface LocationData {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number
    title?: string
    description?: string
    type?: 'emergency' | 'user' | 'responder'
    timestamp?: number
}

interface EmergencyData {
    _id: string
    user: {
        _id: string
        firstName: string
        lastName: string
        phoneNumber: string
    }
    message: string
    contacts: Array<{
        name: string
        number: string
        email: string
        _id: string
    }>
    location: string // JSON string containing coords
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export default function Emergencies() {
    const { user } = useSelector((state: RootState) => state.auth);
    const phone = user?.phoneNumber || "";
    const { data: payload } = useGetEmergenciesQuery(phone, {
        refetchOnFocus: true,
        pollingInterval: 3000
    })
    const searchParams = useSearchParams()
    const livePositions = useEmergencyLivePositions(
        Array.isArray(payload) ? payload : undefined,
    )

    const stats = [
        { name: "Active Alerts", value: 100 },
        { name: "Resolved Alerts", value: 100 },
        { name: "In Progress", value: 100 },
        { name: "Critical", value: 100 },
    ]

    // Prefer live socket coords over REST snapshot for each active emergency
    const emergencyLocations: LocationData[] = useMemo(() => {
        if (!payload || !Array.isArray(payload)) return []

        return payload
            .filter((emergency: EmergencyData) => emergency.isActive)
            .map((emergency: EmergencyData) => {
                try {
                    const live = livePositions[emergency.user._id]
                    if (live) {
                        return {
                            id: emergency._id,
                            latitude: live.latitude,
                            longitude: live.longitude,
                            accuracy: live.accuracy,
                            title: `${emergency.user.firstName} ${emergency.user.lastName}`,
                            description: emergency.message.substring(0, 100) + '...',
                            type: 'emergency' as const,
                            timestamp: live.timestamp,
                        }
                    }

                    const locationData = JSON.parse(emergency.location)
                    return {
                        id: emergency._id,
                        latitude: locationData.coords.latitude,
                        longitude: locationData.coords.longitude,
                        accuracy: locationData.coords?.accuracy,
                        title: `${emergency.user.firstName} ${emergency.user.lastName}`,
                        description: emergency.message.substring(0, 100) + '...',
                        type: 'emergency' as const,
                        timestamp: locationData.timestamp
                    }
                } catch (error) {
                    console.error('Error parsing location data:', error)
                    return null
                }
            })
            .filter(Boolean) as LocationData[]
    }, [payload, livePositions])

    if (!searchParams) {
        return null
    }
    const activeTab = searchParams.get("tab") || "map-view"
    return (
        <section>
            <div className="hidden grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="rounded shadow py-4 px-2">
                        <div className="flex flex-row justify-between items-center">
                            <CardTitle className="text-sm font-medium text-nowrap text-gray-600 font-lato">{stat.name}</CardTitle>
                            <div><p className="text-sm font-bold text-gray-600 font-lato">{stat.value}</p></div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="mt-4">
                <EmergenciesTabs activeTab={activeTab} />
            </div>
            <div className="mt-4">
                <EmergenciesTabContent
                    activeTab={activeTab}
                    locations={emergencyLocations}
                    emergencies={payload || []}
                />

            </div>
        </section>
    )
}
