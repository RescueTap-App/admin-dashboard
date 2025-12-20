import { Button } from "@/components/ui/button";
import { EmergencyListTypes } from "@/types/organization.types";
import { IconEye } from "@tabler/icons-react";
import { AlertDetailsDialog } from "../alert-dialog";
import { useState } from "react";

export function EmergencyActions({ data }: { data: EmergencyListTypes }) {
    console.log(data)
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <Button onClick={() => setIsOpen(true)} variant="link" size="default" className={"rounded"}>
                <IconEye />
                View
            </Button>

            <AlertDetailsDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                status="Resolved"
                priority="Critical"
                alertType="Fire"
                description="Smoke detector activated in Unit 4B"
                user={{
                    name: "Emily Rodriguez",
                    id: "USR-9012",
                }}
                timestamp={{
                    date: "Oct 13, 2025",
                    time: "03:15 PM",
                }}
                location={{
                    address: "20 W 34th Street",
                    coordinates: "40.7580, -73.9855",
                }}
                onMarkAsResolved={() => {
                    console.log("Marked as resolved")
                    setIsOpen(false)
                }}
                onViewOnMap={() => {
                    console.log("View on map clicked")
                }}
                onContactUser={() => {
                    console.log("Contact user clicked")
                }}
            />
        </div>
    )
}


