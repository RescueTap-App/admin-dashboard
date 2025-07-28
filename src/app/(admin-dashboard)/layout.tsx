import RootAdminNavigationLayout from "@/layouts/root-admin-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | Admin Dashboard",
    description: "Manage your account dashboard with ease",
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
