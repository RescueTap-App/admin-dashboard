"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "@/redux/slices/auth-slice";
import {
  canAccessAdminApp,
  homePathForRole,
  isPathAllowedForRole,
} from "@/lib/admin-access";
import { RootState } from "@/lib/store";

interface DecodedToken {
  exp: number;
  role?: string;
  userType?: string;
  [key: string]: unknown;
}

function clearSession() {
  document.cookie = "token=; path=/; expires=" + new Date(0).toUTCString();
  document.cookie = "userType=; path=/; expires=" + new Date(0).toUTCString();
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("userType");
}

export function useRedirect() {
  const router = useRouter();
  const dispatch = useDispatch();
  const sessionUserType = useSelector((state: RootState) => state.auth.user?.userType);

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
      clearSession();
      dispatch(resetUser());
      router.replace("/");
      return;
    }

    const { exp, role } = decoded;
    const userType = decoded.userType ?? sessionUserType;

    if (path.startsWith("/auth") || path === "/") {
      if (!canAccessAdminApp(role, userType)) {
        clearSession();
        dispatch(resetUser());
        return;
      }
      const home = homePathForRole(role);
      if (home) {
        router.replace(home);
      }
      return;
    }

    if (isProtected) {
      if (!canAccessAdminApp(role, userType) || !isPathAllowedForRole(role, path)) {
        clearSession();
        dispatch(resetUser());
        router.replace("/unauthorized");
        return;
      }
    }

    if (exp) {
      const now = Date.now() / 1000;
      const timeUntilExpiry = (exp - now) * 1000;

      if (timeUntilExpiry <= 0) {
        clearSession();
        dispatch(resetUser());
        router.replace("/");
      } else {
        const timeout = setTimeout(() => {
          clearSession();
          dispatch(resetUser());
          router.replace("/");
        }, timeUntilExpiry);

        return () => clearTimeout(timeout);
      }
    }
  }, [dispatch, router, sessionUserType]);
}
