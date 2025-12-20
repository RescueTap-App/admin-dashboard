"use client"
import { Card, CardTitle } from "@/components/ui/card";
import { EmergenciesTabs } from "./manage/tabs";
import { useSearchParams } from "next/navigation";
import { EmergenciesTabContent } from "./manage/tabs/tab-content";
import { useGetEmergenciesQuery } from "@/redux/features/organization-api";
import { io } from "socket.io-client";
import { useEffect, useState, useMemo } from "react";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

const SIGNIFICANT_CHANGE_THRESHOLD = 0.0001; // Adjust threshold as needed

interface LocationData {
    id?: string
    latitude: number
    longitude: number
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

interface Payload {
    "from": string,
    "message": {
        "coords": {
            "accuracy": number,
            "longitude": number,
            "altitude": number,
            "heading": number,
            "latitude": number,
            "altitudeAccuracy": number,
            "speed": number
        },
        "mocked": boolean,
        "timestamp": number
    }
}
export default function Emergencies() {
    const socket = io("https://api.rescuetap.org")
    const { user } = useSelector((state: RootState) => state.auth);
    const phone = user?.phoneNumber || "";
    const { data: payload } = useGetEmergenciesQuery(phone, {
        refetchOnFocus: true,
        pollingInterval: 3000
    })
    const searchParams = useSearchParams()
    const [currentCoords, setCurrentCoords] = useState({ latitude: 0, longitude: 0 })

    const stats = [
        { name: "Active Alerts", value: 100 },
        { name: "Resolved Alerts", value: 100 },
        { name: "In Progress", value: 100 },
        { name: "Critical", value: 100 },
    ]
    useEffect(() => {
        //connect to socket
        socket.on('connect', () => {
            console.log('connected to socket');
        });

        // Listen for emergency events for all users in the emergency data
        if (payload && Array.isArray(payload)) {
            payload.forEach((emergency: EmergencyData) => {
                const userId = emergency.user._id;
                console.log('Setting up listener for user:', userId);

                socket.on('emergency-' + userId, (data: Payload) => {
                    console.log('Received emergency data for user', userId, ':', data);
                    const newlatitude = data.message?.coords?.latitude;
                    const newlongitude = data.message?.coords?.longitude;
                    console.log('cord-', newlatitude, newlongitude);

                    setCurrentCoords((prevCoords) => {
                        const latitudeChange = Math.abs(prevCoords.latitude - newlatitude);
                        const longitudeChange = Math.abs(prevCoords.longitude - newlongitude);

                        console.log('Latitude change:', latitudeChange, 'Longitude change:', longitudeChange);
                        console.log('Previous coords:', prevCoords);
                        console.log('New coords:', { latitude: newlatitude, longitude: newlongitude });

                        if (
                            latitudeChange < SIGNIFICANT_CHANGE_THRESHOLD &&
                            longitudeChange < SIGNIFICANT_CHANGE_THRESHOLD
                        ) {
                            console.log('No significant change, keeping previous coords');
                            return prevCoords; // No significant change
                        }

                        console.log('Significant change detected, updating coords');
                        return {
                            latitude: newlatitude,
                            longitude: newlongitude,
                        }
                    });
                });
            });
        }

        return () => {
            console.log('Cleaning up socket listeners');
            socket.off('connect');

            // Clean up listeners for all users
            if (payload && Array.isArray(payload)) {
                payload.forEach((emergency: EmergencyData) => {
                    socket.off('emergency-' + emergency.user._id);
                });
            }
        };
    }, [socket, payload])

    // Parse emergency data from API
    const emergencyLocations: LocationData[] = useMemo(() => {
        if (!payload || !Array.isArray(payload)) return []

        return payload
            .filter((emergency: EmergencyData) => emergency.isActive)
            .map((emergency: EmergencyData) => {
                try {
                    const locationData = JSON.parse(emergency.location)
                    return {
                        id: emergency._id,
                        latitude: locationData.coords.latitude,
                        longitude: locationData.coords.longitude,
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
    }, [payload])

    if (!searchParams) {
        return null
    }
    const activeTab = searchParams.get("tab") || "map-view"
    // console.log('Key', MAPS_API_KEY);
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
                    locations={[
                        // Current user location from socket
                        ...(currentCoords.latitude && currentCoords.longitude ? [{
                            id: 'current-user',
                            latitude: currentCoords.latitude,
                            longitude: currentCoords.longitude,
                            title: 'Current User Location',
                            type: 'user' as const,
                            timestamp: Date.now()
                        }] : []),

                        // Real emergency locations from API
                        ...emergencyLocations
                    ]}
                    emergencies={payload || []}
                />

            </div>
        </section>
    )
}