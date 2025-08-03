import UpdateDriver from "@/components/customs/admin-dashboard/organizations/drivers/update";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rescue Tap | Update Driver",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <UpdateDriver driverId={id} />
}

