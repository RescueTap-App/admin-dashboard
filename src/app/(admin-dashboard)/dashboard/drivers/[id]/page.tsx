import DriverDetails from "@/components/customs/admin-dashboard/organizations/drivers/details";
import React from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Rescue Tap | Driver Details",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <DriverDetails driverId={id} />
}
