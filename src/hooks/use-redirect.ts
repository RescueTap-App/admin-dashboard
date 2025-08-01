"use client"

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

        if (!token) return;

        let decoded: DecodedToken;

        try {
            decoded = jwtDecode<DecodedToken>(token);
        } catch (err) {
            console.error("Failed to decode token", err);
            router.replace("/auth/login");
            return;
        }

        const { exp, role } = decoded;

        // 🧠 Role-based redirection
        const path = window.location.pathname;

        if (role === "admin" && !path.startsWith("/dashboard")) {
            router.replace("/unauthorized"); // or '/'
            return;
        }

        if (role === "organization" && !path.startsWith("/org")) {
            router.replace("/unauthorized"); // or '/'
            return;
        }

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
