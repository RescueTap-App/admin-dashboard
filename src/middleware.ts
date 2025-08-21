import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    role?: string;
}

const PUBLIC_ROUTES = ["/", "/auth/forgot-password", "/auth/new-password", "/auth/verify-otp", "/"];
const ADMIN_PROTECTED = ["/dashboard"];
const ORG_PROTECTED = ["/org"];

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (!token) {
        // Block protected routes if unauthenticated
        if (ADMIN_PROTECTED.some((path) => pathname.startsWith(path)) ||
            ORG_PROTECTED.some((path) => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    let decoded: DecodedToken;
    try {
        decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
        console.error("Invalid token", err);
        return NextResponse.redirect(new URL("/", request.url));
    }

    const { exp, role } = decoded;
    const now = Date.now() / 1000;

    // Expired token
    if (exp && exp < now) {
        const res = NextResponse.redirect(new URL("/", request.url));
        res.cookies.delete("token");
        return res;
    }

    // Redirect logged-in users away from signup/register pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        if (role === "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else if (role === "organization") {
            return NextResponse.redirect(new URL("/org", request.url));
        }
    }

    // Role-based access restriction
    if (pathname.startsWith("/dashboard") && role !== "admin") {
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
    ],
};
