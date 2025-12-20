import React from 'react'
import type { Metadata } from "next";
import Emergencies from '@/components/customs/org-dashboard/organizations/emergencies';

export const metadata: Metadata = {
    title: "Rescue Tap | Emergencies",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

export default function Page() {
    return (
        <Emergencies />
    )
}