import TipsPage from '@/components/customs/admin-dashboard/organizations/tips/tip-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rescue Tap | Tips",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};


function Page() {
    return (
        <TipsPage />
    )
}

export default Page
