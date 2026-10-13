import VisitorVerification from "@/components/customs/org-dashboard/organizations/visitors-registry/visitor-verification";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Verify Visitor",
    description: "Scan a visitor or personnel QR code with the front camera",
};

export default function Page() {
    return (
        <div className="container mx-auto py-8">
            <VisitorVerification selectOrganization />
        </div>
    )
}
