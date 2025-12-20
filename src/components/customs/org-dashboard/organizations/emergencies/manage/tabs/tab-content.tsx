import MapView from "../map-view/map"
import ListView from "../list-view"

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

interface EmergenciesTabContentProps {
    activeTab: string
    locations?: LocationData[]
    emergencies?: EmergencyData[]
}

export function EmergenciesTabContent({ activeTab, locations = [], emergencies = [] }: EmergenciesTabContentProps) {
    const renderTabContent = () => {
        switch (activeTab) {
            case "map-view":
                return <MapView locations={locations} emergencies={emergencies} />
            case "list-view":
                return <ListView emergencies={emergencies} />
        }
    }

    return <div className="bg-white  p-4 rounded-lg shadow-lg">{renderTabContent()}</div>
}
