import { ListEmergenciesTable } from "./table"
import { EmergencyListTypes } from "@/types/organization.types"
import { Suspense, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconMail, IconPhone } from "@tabler/icons-react"

// Contact utility functions
function openEmailClient(user: { firstName: string; lastName: string }, emergency: { createdAt: string; isActive: boolean; location: string; message: string }) {
    const subject = `Emergency Response Required - ${user.firstName} ${user.lastName}`;

    const body = `Dear ${user.firstName} ${user.lastName},

I am writing regarding the emergency alert you submitted through our RescueTap system.

Emergency Details:
- Time: ${new Date(emergency.createdAt).toLocaleString()}
- Status: ${emergency.isActive ? 'Active' : 'Resolved'}
- Location: ${(() => {
            try {
                const locationData = JSON.parse(emergency.location);
                return `Lat: ${locationData.coords.latitude.toFixed(6)}, Lng: ${locationData.coords.longitude.toFixed(6)}`;
            } catch {
                return 'Location data unavailable';
            }
        })()}

Message: ${emergency.message}

Our emergency response team has been notified and is taking appropriate action. Please stay safe and follow any instructions provided by emergency responders.

If you need immediate assistance, please contact emergency services directly.

Best regards,
RescueTap Emergency Response Team
Phone: Emergency Services
Email: support@rescuetap.org`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
}

function openWhatsAppOrPhone(user: { firstName: string; lastName: string; phoneNumber: string }, emergency: { createdAt: string; isActive: boolean; location: string; message: string }) {
    const phoneNumber = user.phoneNumber.replace(/\D/g, '');

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const message = `*RescueTap Emergency Response*\n\nDear ${user.firstName} ${user.lastName},\n\nWe received your emergency alert through our system.\n\n*Emergency Details:*\n• Time: ${new Date(emergency.createdAt).toLocaleString()}\n• Status: ${emergency.isActive ? '🟥 ACTIVE' : '✅ RESOLVED'}\n• Location: ${(() => {
        try {
            const locationData = JSON.parse(emergency.location);
            return `Lat: ${locationData.coords.latitude.toFixed(6)}, Lng: ${locationData.coords.longitude.toFixed(6)}`;
        } catch {
            return 'Location data unavailable';
        }
    })()}\n\n*Your Message:* ${emergency.message}\n\nOur emergency response team has been notified. Please stay safe and follow instructions from emergency responders.\n\nFor immediate help, contact emergency services.\n\n_Best regards,_\n*RescueTap Emergency Team*`;

    if (isMobile) {
        const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const checkWhatsApp = setTimeout(() => {
            window.location.href = `tel:${phoneNumber}`;
        }, 1000);

        window.location.href = whatsappUrl;

        setTimeout(() => {
            clearTimeout(checkWhatsApp);
        }, 2000);
    } else {
        const whatsappWebUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappWebUrl, '_blank');
    }
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

interface ListViewProps {
    emergencies?: EmergencyData[]
}

export default function ListView({ emergencies = [] }: ListViewProps) {
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyData | null>(null)

    const handleRowClick = (emergencyData: EmergencyListTypes) => {
        // Find the full emergency data by ID
        const fullEmergency = emergencies.find(e => e._id === emergencyData._id)
        if (fullEmergency) {
            setSelectedEmergency(fullEmergency)
        }
    }

    // Transform emergency data to match EmergencyListTypes
    const data: EmergencyListTypes[] = emergencies.map((emergency) => {
        try {
            const locationData = JSON.parse(emergency.location)
            return {
                _id: emergency._id,
                user: {
                    _id: emergency.user._id,
                    firstName: emergency.user.firstName,
                    lastName: emergency.user.lastName,
                },
                location: `Lat: ${locationData.coords.latitude.toFixed(6)}, Lng: ${locationData.coords.longitude.toFixed(6)}`,
                timestamp: new Date(locationData.timestamp || emergency.createdAt),
                status: emergency.isActive ? "active" : "resolved",
                priority: "critical", // You can add logic to determine priority based on emergency type
                createdAt: new Date(emergency.createdAt),
                updatedAt: new Date(emergency.updatedAt),
            }
        } catch (error) {
            console.error('Error parsing emergency location:', error)
            return {
                _id: emergency._id,
                user: {
                    _id: emergency.user._id,
                    firstName: emergency.user.firstName,
                    lastName: emergency.user.lastName,
                },
                location: "Location data unavailable",
                timestamp: new Date(emergency.createdAt),
                status: emergency.isActive ? "active" : "resolved",
                priority: "medium",
                createdAt: new Date(emergency.createdAt),
                updatedAt: new Date(emergency.updatedAt),
            }
        }
    })

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-xl font-bold font-lato">Emergency List</h1>
                <p>{data.length} Alert{data.length !== 1 ? 's' : ''} Found</p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <ListEmergenciesTable data={data || []} onRowClick={handleRowClick} />
            </Suspense>

            {/* Emergency Details Dialog */}
            <Dialog open={!!selectedEmergency} onOpenChange={() => setSelectedEmergency(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            🚨 Emergency Alert Details
                        </DialogTitle>
                        <DialogDescription>
                            Emergency reported by {selectedEmergency?.user.firstName} {selectedEmergency?.user.lastName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedEmergency && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600">Contact Information</h4>
                                    <p className="text-sm">{selectedEmergency.user.firstName} {selectedEmergency.user.lastName}</p>
                                    <p className="text-sm text-blue-600">{selectedEmergency.user.phoneNumber}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-600">Emergency Time</h4>
                                    <p className="text-sm">{new Date(selectedEmergency.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Emergency Message</h4>
                                <div className="bg-gray-50 p-3 rounded-md border">
                                    <p className="text-sm whitespace-pre-wrap">{selectedEmergency.message}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Emergency Contacts</h4>
                                <div className="space-y-2">
                                    {selectedEmergency.contacts.map((contact, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <div>
                                                <p className="text-sm font-medium">{contact.name}</p>
                                                <p className="text-sm text-blue-600">{contact.number}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{contact.email}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-gray-600 mb-2">Location Information</h4>
                                {(() => {
                                    try {
                                        const locationData = JSON.parse(selectedEmergency.location)
                                        return (
                                            <div className="bg-gray-50 p-3 rounded-md border">
                                                <p className="text-sm"><strong>Coordinates:</strong></p>
                                                <p className="text-sm font-mono">
                                                    Lat: {locationData.coords.latitude.toFixed(6)}<br />
                                                    Lng: {locationData.coords.longitude.toFixed(6)}
                                                </p>
                                                <p className="text-sm mt-2"><strong>Accuracy:</strong> {locationData.coords.accuracy.toFixed(1)}m</p>
                                                <p className="text-sm"><strong>Timestamp:</strong> {new Date(locationData.timestamp).toLocaleString()}</p>
                                            </div>
                                        )
                                    } catch (error) {
                                        console.log(error)
                                        return (
                                            <div className="bg-red-50 p-3 rounded-md border border-red-200">
                                                <p className="text-sm text-red-600">Location data unavailable</p>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={() => openEmailClient(selectedEmergency.user, selectedEmergency)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <IconMail className="w-4 h-4 mr-2" />
                                    Email User
                                </Button>
                                <Button
                                    onClick={() => openWhatsAppOrPhone(selectedEmergency.user, selectedEmergency)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <IconPhone className="w-4 h-4 mr-2" />
                                    Contact User
                                </Button>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${selectedEmergency.isActive
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {selectedEmergency.isActive ? 'Active Emergency' : 'Resolved'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    ID: {selectedEmergency._id}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
