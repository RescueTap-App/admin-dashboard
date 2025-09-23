import InviteVisitor from "@/components/customs/org-dashboard/organizations/visitors-registry/invite-visitor";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Invite Visitor",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

export default function Page() {
    return (
        <InviteVisitor />
    )
}
