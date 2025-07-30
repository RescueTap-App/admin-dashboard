import { Metadata } from 'next';
import DriverTravels from "@/components/customs/admin-dashboard/organizations/drivers/travels";
import React from 'react'

export const metadata: Metadata = {
    title: "Rescue Tap| Driver Travels",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function Page() {
    return (
        <DriverTravels />
    )
}
