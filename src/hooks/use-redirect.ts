"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  canAccessAdminApp,
  homePathForRole,
  isPathAllowedForRole,
} from "@/lib/admin-access";

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
    const isProtected =
      path.startsWith("/dashboard") || path.startsWith("/org");

    if (!token) {
      if (isProtected) {
        router.replace("/");
      }
      return;
    }

    let decoded: DecodedToken;

    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error("Failed to decode token", err);
      document.cookie =
        "token=; path=/; expires=" + new Date(0).toUTCString();
      router.replace("/");
      return;
    }

    const { exp, role } = decoded;

    if (path.startsWith("/auth") || path === "/") {
      const home = homePathForRole(role);
      if (home) {
        router.replace(home);
      }
      return;
    }

    if (isProtected) {
      if (!canAccessAdminApp(role) || !isPathAllowedForRole(role, path)) {
        document.cookie =
          "token=; path=/; expires=" + new Date(0).toUTCString();
        router.replace("/unauthorized");
        return;
      }
    }

    if (exp) {
      const now = Date.now() / 1000;
      const timeUntilExpiry = (exp - now) * 1000;

      if (timeUntilExpiry <= 0) {
        document.cookie =
          "token=; path=/; expires=" + new Date(0).toUTCString();
        router.replace("/");
      } else {
        const timeout = setTimeout(() => {
          document.cookie =
            "token=; path=/; expires=" + new Date(0).toUTCString();
          router.replace("/");
        }, timeUntilExpiry);

        return () => clearTimeout(timeout);
      }
    }
  }, [router]);
}
