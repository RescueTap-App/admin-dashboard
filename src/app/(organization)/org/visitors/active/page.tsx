import ActiveVisitors from "@/components/customs/org-dashboard/organizations/visitors-registry/active-visitors";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Active Visitors",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};
export default function Page() {
    return (
        <ActiveVisitors />
    )
}
