import type { Metadata } from "next";
import { Fragment } from "react";

export const metadata: Metadata = {
    title: "Rescue Tap | Auths",
    description: "Manage your account dashboard with ease",
};

export default function UsersRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}
