"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export type AlertStatus = "Active" | "Resolved" | "In Progress"
export type AlertPriority = "Critical" | "High" | "Medium" | "Low"

interface AlertDialogProps {
    isOpen: boolean
    onClose: () => void
    status: AlertStatus
    priority: AlertPriority
    alertType: string
    description: string
    user: {
        name: string
        id: string
    }
    timestamp: {
        date: string
        time: string
    }
    location: {
        address: string
        coordinates: string
    }
    onMarkAsResolved?: () => void
    onViewOnMap?: () => void
    onContactUser?: () => void
}

const statusConfig: Record<AlertStatus, { color: string; dot: string }> = {
    Active: { color: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
    Resolved: { color: "bg-green-100 text-green-800", dot: "bg-green-500" },
    "In Progress": { color: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
}

const priorityConfig: Record<AlertPriority, { color: string; bg: string }> = {
    Critical: { color: "bg-red-600 text-white", bg: "bg-red-50" },
    High: { color: "bg-orange-600 text-white", bg: "bg-orange-50" },
    Medium: { color: "bg-yellow-600 text-white", bg: "bg-yellow-50" },
    Low: { color: "bg-blue-600 text-white", bg: "bg-blue-50" },
}

export function AlertDetailsDialog({
    isOpen,
    onClose,
    status,
    priority,
    alertType,
    description,
    user,
    timestamp,
    location,
    onMarkAsResolved,
    onViewOnMap,
    onContactUser,
}: AlertDialogProps) {
    const statusConfig_ = statusConfig[status]
    const priorityConfig_ = priorityConfig[priority]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md rounded-lg p-6 shadow-lg">
                <DialogTitle />
                {/* Close Button */}
                <DialogClose className="absolute right-4 top-4">
                    <X className="h-5 w-5" />
                </DialogClose>

                {/* Header with Status, Priority and Type */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        Alert Details
                    </h2>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${statusConfig_.dot}`}></div>
                            <span className="text-sm font-medium text-foreground">{status}</span>
                        </div>

                        {/* Priority Badge */}
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityConfig_.color}`}>
                            {priority} Priority
                        </span>

                        {/* Alert Type */}
                        <span className="text-sm text-muted-foreground">{alertType}</span>
                    </div>
                </div>

                {/* Description Section */}
                <div className={`rounded-lg p-4 mb-6 ${priorityConfig_.bg}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-xl mt-1">⚠️</span>
                        <div>
                            <h3 className="font-semibold text-sm mb-1">Description</h3>
                            <p className="text-sm text-foreground">{description}</p>
                        </div>
                    </div>
                </div>

                {/* User and Timestamp */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* User */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">👤</span>
                            <h4 className="font-semibold text-sm">User</h4>
                        </div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                    </div>

                    {/* Timestamp */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⏰</span>
                            <h4 className="font-semibold text-sm">Timestamp</h4>
                        </div>
                        <p className="text-sm font-medium text-foreground">{timestamp.date}</p>
                        <p className="text-xs text-muted-foreground">{timestamp.time}</p>
                    </div>
                </div>

                {/* Location */}
                <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📍</span>
                        <h4 className="font-semibold text-sm">Location</h4>
                    </div>
                    <p className="text-sm font-medium text-foreground">{location.address}</p>
                    <p className="text-xs text-muted-foreground">Coordinates: {location.coordinates}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={onMarkAsResolved}>
                        Mark as Resolved
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={onViewOnMap}>
                        View on Map
                    </Button>
                    <Link href={`tel:2349165329403`}>
                        <Button variant="outline" className="flex-1 bg-transparent" onClick={onContactUser}>
                            Contact User
                        </Button>
                    </Link>
                </div>

            </DialogContent>
        </Dialog>
    )
}
