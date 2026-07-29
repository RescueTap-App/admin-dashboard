import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import {
    canAccessAdminApp,
    homePathForRole,
    isPathAllowedForRole,
} from "@/lib/admin-access";

interface DecodedToken {
    exp: number;
    role?: string;
}

const PUBLIC_ROUTES = [
    "/",
    "/auth/forgot-password",
    "/auth/new-password",
    "/auth/verify-otp",
    "/auth/signup",
];

const AUTH_PREFIXES = ["/auth"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname, search } = request.nextUrl;

    const redirectToAuth = () => {
        const redirectUrl = new URL("/", request.url);
        redirectUrl.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(redirectUrl);
    };

    const isPublic =
        PUBLIC_ROUTES.includes(pathname) ||
        AUTH_PREFIXES.some((p) => pathname.startsWith(p));

    const isAdminArea = pathname.startsWith("/dashboard");
    const isOrgArea = pathname.startsWith("/org");
    const isProtected = isAdminArea || isOrgArea;

    if (!token) {
        if (isProtected) {
            return redirectToAuth();
        }
        return NextResponse.next();
    }

    let decoded: DecodedToken;
    try {
        decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
        console.error("Invalid token", err);
        const res = redirectToAuth();
        res.cookies.delete("token");
        return res;
    }

    const { exp, role } = decoded;
    const now = Date.now() / 1000;

    if (exp && exp < now) {
        const res = redirectToAuth();
        res.cookies.delete("token");
        return res;
    }

    // Logged-in users without admin-app roles should not keep a session here
    if (!canAccessAdminApp(role) && isProtected) {
        const res = NextResponse.redirect(new URL("/unauthorized", request.url));
        res.cookies.delete("token");
        return res;
    }

    // Redirect logged-in admins/orgs away from public auth/home
    if (isPublic || pathname === "/") {
        const home = homePathForRole(role);
        if (home) {
            return NextResponse.redirect(new URL(home, request.url));
        }
    }

    if (isProtected && !isPathAllowedForRole(role, pathname)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
