import SignInPage from '@/components/customs/auths/login';
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Rescue Tap | Auth | Sign Up",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awareness",
};


function Page() {
    return (
        <SignInPage />
    )
}

export default Page
