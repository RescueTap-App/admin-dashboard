interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface EmergencyData {
    _id: string;
    user: User;
    message: string;
    contacts: Array<{
        name: string;
        number: string;
        email: string;
        _id: string;
    }>;
    location: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Opens the default email client with a professional emergency response message
 */
export function openEmailClient(user: User, emergency: EmergencyData) {
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

/**
 * Opens WhatsApp or phone app with a professional emergency response message
 */
export function openWhatsAppOrPhone(user: User, emergency: EmergencyData) {
    const phoneNumber = user.phoneNumber.replace(/\D/g, ''); // Remove non-digits

    // Check if WhatsApp is available (mobile or WhatsApp web)
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
        // Try WhatsApp first
        const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        // Fallback to phone call if WhatsApp fails
        const checkWhatsApp = setTimeout(() => {
            window.location.href = `tel:${phoneNumber}`;
        }, 1000);

        window.location.href = whatsappUrl;

        // Clear the fallback if WhatsApp opens
        setTimeout(() => {
            clearTimeout(checkWhatsApp);
        }, 2000);
    } else {
        // Desktop: Try WhatsApp Web, fallback to phone
        const whatsappWebUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappWebUrl, '_blank');
    }
}

/**
 * Gets the primary user ID from emergency data array
 * Returns the first active emergency's user ID, or null if none found
 */
export function getPrimaryUserId(emergencies: EmergencyData[]): string | null {
    if (!Array.isArray(emergencies) || emergencies.length === 0) {
        return null;
    }

    // Find the first active emergency and return its user ID
    const activeEmergency = emergencies.find(emergency => emergency.isActive);
    return activeEmergency ? activeEmergency.user._id : null;
}
