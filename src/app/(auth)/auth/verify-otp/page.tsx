import VerifyOtpCode from "@/components/customs/auths/verify-otp";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Rescue Tap | Auth | Verify otp",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};

export default function Page() {
    return (
        <VerifyOtpCode/>
    )
}
