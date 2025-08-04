import CreateDriver from '@/components/customs/org-dashboard/organizations/drivers/create';
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Rescue Tap | Create Driver",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function Page() {
    return (
        <CreateDriver />
    )
}
