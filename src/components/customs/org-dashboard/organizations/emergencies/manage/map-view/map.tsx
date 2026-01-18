import React, { useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { MAPS_API_KEY } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconMapPin, IconMail, IconPhone } from '@tabler/icons-react'
import { openEmailClient, openWhatsAppOrPhone } from '../contact-utils'


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
    location: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface MapViewProps {
    locations?: LocationData[]
    emergencies?: EmergencyData[]
}

const containerStyle = {
    width: '100%',
    height: '400px',
}

const center = { lat: 7.54992, lng: 9.00678 };

export default function MapView({ locations = [], emergencies = [] }: MapViewProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: MAPS_API_KEY!,
    })

    const [, setMap] = React.useState<google.maps.Map | null>(null)
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyData | null>(null)

    // Find emergency data by location ID
    const findEmergencyByLocation = (locationId: string | undefined): EmergencyData | null => {
        if (!locationId) return null
        return emergencies.find(emergency => emergency._id === locationId) || null
    }

    const onLoad = React.useCallback(function callback(map: google.maps.Map) {
        // Create bounds that include all locations and center
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(center) // Always include the default center

        // Include all location points in bounds
        locations.forEach(location => {
            bounds.extend({
                lat: location.latitude,
                lng: location.longitude
            })
        })

        // If no locations provided, just use the default center
        // The empty state overlay will be displayed

        map.fitBounds(bounds)

        setMap(map)
    }, [locations])

    const onUnmount = React.useCallback(function callback() {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div>
            <Button variant="link" size="default" className={"rounded mb-2"}>
                <IconMapPin />
                Add Marker
            </Button>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                {/* Child components, such as markers, info windows, etc. */}

                {/* Empty state overlay when no emergencies */}
                {locations.length === 0 && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                        <div className="text-center max-w-md mx-auto p-6 bg-white/95 rounded-lg shadow-lg border">
                            <div className="w-16 h-16 mx-auto mb-4 text-primary">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                All Clear
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                No active emergencies are currently being monitored in your area.
                                The system is operational and ready to respond to any incoming alerts.
                            </p>
                            <div className="mt-4 text-xs text-gray-500">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Render markers for provided locations */}
                {locations.map((location, index) => {
                    const emergencyData = findEmergencyByLocation(location.id)
                    return (
                        <Marker
                            key={location.id || `marker-${index}`}
                            position={{
                                lat: location.latitude,
                                lng: location.longitude
                            }}
                            title={location.title || `Emergency #${index + 1}`}
                            onClick={() => {
                                if (emergencyData) {
                                    setSelectedEmergency(emergencyData)
                                }
                            }}
                            // Custom icon for different location types
                            icon={location.type === 'emergency' ? {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="20" cy="20" r="18" fill="white" stroke="#dc2626" stroke-width="4"/>
                                        <circle cx="20" cy="20" r="10" fill="#dc2626"/>
                                        <circle cx="20" cy="14" r="3" fill="white"/>
                                        <rect x="18" y="20" width="4" height="8" fill="white" rx="1"/>
                                    </svg>
                                `),
                                scaledSize: new google.maps.Size(40, 40),
                                anchor: new google.maps.Point(20, 40)
                            } : undefined}
                        />
                    )
                })}

                {/* InfoWindow for selected emergency */}
                {selectedEmergency && (() => {
                    try {
                        const locationData = JSON.parse(selectedEmergency.location)
                        return (
                            <InfoWindow
                                position={{
                                    lat: locationData.coords.latitude,
                                    lng: locationData.coords.longitude
                                }}
                                onCloseClick={() => setSelectedEmergency(null)}
                            >
                                <div className="p-3 max-w-sm">
                                    <h3 className="font-semibold text-lg text-red-600 mb-2">
                                        🚨 Emergency Alert
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">Name:</span> {selectedEmergency.user.firstName} {selectedEmergency.user.lastName}
                                        </div>
                                        <div>
                                            <span className="font-medium">Phone:</span> {selectedEmergency.user.phoneNumber}
                                        </div>
                                        <div>
                                            <span className="font-medium">Time:</span> {new Date(selectedEmergency.createdAt).toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Message:</span>
                                            <p className="mt-1 text-xs text-gray-600 max-h-20 overflow-y-auto">
                                                {selectedEmergency.message}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Contacts:</span>
                                            <div className="mt-1 space-y-1">
                                                {selectedEmergency.contacts.map((contact, idx) => (
                                                    <div key={idx} className="text-xs">
                                                        {contact.name}: {contact.number}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3 pt-3 border-t">
                                        <Button
                                            onClick={() => openEmailClient(selectedEmergency.user, selectedEmergency)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs"
                                        >
                                            <IconMail className="w-3 h-3 mr-1" />
                                            Email
                                        </Button>
                                        <Button
                                            onClick={() => openWhatsAppOrPhone(selectedEmergency.user, selectedEmergency)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs"
                                        >
                                            <IconPhone className="w-3 h-3 mr-1" />
                                            Contact
                                        </Button>
                                    </div>
                                </div>
                            </InfoWindow>
                        )
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                })()}
            </GoogleMap>
        </div>
    ) : (
        <></>
    )
}