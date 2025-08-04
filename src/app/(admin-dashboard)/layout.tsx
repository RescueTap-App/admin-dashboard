import RootAdminNavigationLayout from "@/layouts/root-admin-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Admin Dashboard",
    description: "Rescue Tap instantly let's you share your location send emergency alerts and stay connected with the people who matter most, because safety starts with awarenes",
};

export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RootAdminNavigationLayout>
                {children}
        </RootAdminNavigationLayout>
    );
}
