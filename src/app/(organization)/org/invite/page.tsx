import InviteOrgUser from '@/components/customs/org-dashboard/organizations/org-users/invite';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescue Tap | Invite Organization User",
  description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

function Page() {
  return (
    <InviteOrgUser />
  )
}

export default Page
