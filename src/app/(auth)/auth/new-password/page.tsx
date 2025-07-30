import ResetOldPassword from '@/components/customs/auths/reset-password';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Auth | Reset Password",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

function Page() {
    return (
        <ResetOldPassword />
    )
}

export default Page
