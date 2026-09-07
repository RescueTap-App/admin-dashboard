"use client"
import { Card, CardTitle } from "@/components/ui/card";
import { EmergenciesTabs } from "./manage/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmergenciesTabContent } from "./manage/tabs/tab-content";
import { useGetEmergenciesQuery } from "@/redux/features/organization-api";
import { useMemo } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useEmergencyLivePositions } from "@/hooks/use-emergency-live-positions";
import { useGetAdminReportsQuery } from "@/redux/features/reports-api";
import type { Report } from "@/types/reports.types";

interface LocationData {
    id?: string
    latitude: number
    longitude: number
    accuracy?: number
    title?: string
    description?: string
    type?: 'emergency' | 'report' | 'user' | 'responder'
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
    const { data: reportsPayload } = useGetAdminReportsQuery()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const from = searchParams?.get("from")
    const to = searchParams?.get("to")
    const livePositions = useEmergencyLivePositions(
        Array.isArray(payload) ? payload : undefined,
    )

    const filteredEmergencies = useMemo(() => {
        if (!Array.isArray(payload)) return []
        return payload.filter((emergency: EmergencyData) => {
            const createdAt = new Date(emergency.createdAt)
            if (from && createdAt < new Date(`${from}T00:00:00`)) return false
            if (to && createdAt > new Date(`${to}T23:59:59.999`)) return false
            return true
        })
    }, [from, payload, to])

    const filteredReports = useMemo(() => {
        if (!Array.isArray(reportsPayload)) return []
        return reportsPayload.filter((report) => {
            const createdAt = new Date(report.createdAt)
            if (from && createdAt < new Date(`${from}T00:00:00`)) return false
            if (to && createdAt > new Date(`${to}T23:59:59.999`)) return false
            return true
        })
    }, [from, reportsPayload, to])

    const stats = [
        { name: "Active Alerts", value: 100 },
        { name: "Resolved Alerts", value: 100 },
        { name: "In Progress", value: 100 },
        { name: "Critical", value: 100 },
    ]

    // Prefer live socket coords over REST snapshot for each active emergency
    const emergencyLocations: LocationData[] = useMemo(() => {
        if (!filteredEmergencies.length && !filteredReports.length) return []

        const emergencies = filteredEmergencies
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

        const reports = filteredReports
            .filter((report) => Number.isFinite(report.location?.latitude) && Number.isFinite(report.location?.longitude))
            .map((report) => ({
                id: report._id,
                latitude: report.location!.latitude!,
                longitude: report.location!.longitude!,
                title: report.category || "Incident report",
                description: report.description || "No description provided",
                type: "report" as const,
                timestamp: new Date(report.createdAt).getTime(),
            }))

        return [...emergencies, ...reports]
    }, [filteredEmergencies, filteredReports, livePositions])

    if (!searchParams) {
        return null
    }
    const activeTab = searchParams.get("tab") || "map-view"
    return (
        <section>
            <div className="mb-4 flex flex-wrap items-end gap-3">
                <label className="grid gap-1 text-sm font-medium">
                    From
                    <input
                        type="date"
                        value={from || ""}
                        onChange={(event) => {
                            const params = new URLSearchParams(searchParams.toString())
                            event.target.value ? params.set("from", event.target.value) : params.delete("from")
                            router.replace(`${pathname}?${params.toString()}`)
                        }}
                        className="h-10 rounded border px-3"
                    />
                </label>
                <label className="grid gap-1 text-sm font-medium">
                    To
                    <input
                        type="date"
                        value={to || ""}
                        onChange={(event) => {
                            const params = new URLSearchParams(searchParams.toString())
                            event.target.value ? params.set("to", event.target.value) : params.delete("to")
                            router.replace(`${pathname}?${params.toString()}`)
                        }}
                        className="h-10 rounded border px-3"
                    />
                </label>
            </div>
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
                    emergencies={filteredEmergencies}
                    reports={filteredReports as Report[]}
                />

            </div>
        </section>
    )
}
