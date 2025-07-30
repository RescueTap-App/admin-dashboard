import CreateOrganiztion from "@/components/customs/admin-dashboard/organizations/create";
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Rescue Tap | Create Organization",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function Page() {
    return (
        <CreateOrganiztion />
    )
}
