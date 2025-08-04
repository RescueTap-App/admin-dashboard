"use client";

import { useRedirect } from "@/hooks/use-redirect";
import { Fragment } from "react";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    useRedirect();
    return <Fragment>{children}</Fragment>;
}
