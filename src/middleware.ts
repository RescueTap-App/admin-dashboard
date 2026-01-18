import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    role?: string;
}

const PUBLIC_ROUTES = ["/", "/auth/forgot-password", "/auth/new-password", "/auth/verify-otp", "/"];
const ADMIN_PROTECTED = ["/dashboard/organizations"];
const ORG_PROTECTED = ["/org"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname, search } = request.nextUrl;

    // Helper to build redirect with intended URL
    const redirectToAuth = () => {
        const redirectUrl = new URL("/", request.url);
        redirectUrl.searchParams.set("redirect", pathname + search);
        return NextResponse.redirect(redirectUrl);
    };

    if (!token) {
        // Block protected routes if unauthenticated
        if (
            ADMIN_PROTECTED.some((path) => pathname.startsWith(path)) ||
            ORG_PROTECTED.some((path) => pathname.startsWith(path))
        ) {
            return redirectToAuth();
        }
        return NextResponse.next();
    }

    let decoded: DecodedToken;
    try {
        decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
        console.error("Invalid token", err);
        return redirectToAuth();
    }

    const { exp, role } = decoded;
    const now = Date.now() / 1000;

    // Expired token
    if (exp && exp < now) {
        const res = redirectToAuth();
        res.cookies.delete("token");
        return res;
    }

    // Redirect logged-in users away from signup/register pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        if (role === "admin") {
            return NextResponse.redirect(new URL("/dashboard/organizations", request.url));
        } else if (role === "organization") {
            return NextResponse.redirect(new URL("/org", request.url));
        }
    }

    // Role-based access restriction
    if (pathname.startsWith("/dashboard/organizations") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/org") && role !== "organization") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
