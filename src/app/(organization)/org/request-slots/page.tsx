import { RequestSlots } from '@/components/customs/org-dashboard/organizations/request-slots'
import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Request Slots",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};
function Page() {
    return (
        <RequestSlots />
    )
}

export default Page
