import BulkRegistration from '@/components/customs/org-dashboard/organizations/bulk-registry/create'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Bulk Registration",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

function Page() {
    return (
        <BulkRegistration />
    )
}

export default Page
