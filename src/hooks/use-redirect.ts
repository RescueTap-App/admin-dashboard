"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    role?: string;
    [key: string]: unknown;
}

export function useRedirect() {
    const router = useRouter();

    useEffect(() => {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        const path = window.location.pathname;

        if (!token) {
            // If not logged in, block access to protected routes
            if (path.startsWith("/dashboard") || path.startsWith("/org")) {
                router.replace("/auth/login");
            }
            return;
        }

        let decoded: DecodedToken;

        try {
            decoded = jwtDecode<DecodedToken>(token);
        } catch (err) {
            console.error("Failed to decode token", err);
            router.replace("/auth/login");
            return;
        }

        const { exp, role } = decoded;

        // Redirect logged-in users away from auth pages
        if (path.startsWith("/auth")) {
            if (role === "admin") {
                router.replace("/dashboard");
            } else if (role === "organization") {
                router.replace("/org");
            } else {
                router.replace("/");
            }
            return;
        }

        // Role-based access control
        if (role === "admin" && !path.startsWith("/dashboard")) {
            router.replace("/unauthorized");
            return;
        }

        if (role === "organization" && !path.startsWith("/org")) {
            router.replace("/unauthorized");
            return;
        }

        // Token expiry handling
        if (exp) {
            const now = Date.now() / 1000;
            const timeUntilExpiry = (exp - now) * 1000;

            if (timeUntilExpiry <= 0) {
                document.cookie = "token=; path=/; expires=" + new Date(0).toUTCString();
                router.replace("/auth/login");
            } else {
                const timeout = setTimeout(() => {
                    document.cookie = "token=; path=/; expires=" + new Date(0).toUTCString();
                    router.replace("/auth/login");
                }, timeUntilExpiry);

                return () => clearTimeout(timeout);
            }
        }
    }, [router]);
}
