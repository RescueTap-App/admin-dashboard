import RootUserNavigationLayout from "@/layouts/root-user-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Organization",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function UsersRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RootUserNavigationLayout>
            {children}
        </RootUserNavigationLayout>
    );
}
