import { RequestSlots } from '@/components/customs/org-dashboard/organizations/vehicles-registry/request-slots';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rescue Tap | Vehicle Slots",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function Page() {
    return (
        <RequestSlots />
    )
}
