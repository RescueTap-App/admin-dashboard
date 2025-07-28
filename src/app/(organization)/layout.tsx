import RootUserNavigationLayout from "@/layouts/root-user-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rescue Tap | User Dashboard",
    description: "Manage your account dashboard with ease",
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
