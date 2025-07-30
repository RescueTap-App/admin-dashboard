import ForgotPassword from '@/components/customs/auths/forgot-password'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Auth | Forgot Password",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

export default function Page() {
    return (
        <ForgotPassword/>
    )
}
