// middleware.js (or middleware.ts if using TypeScript)
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js Middleware for authentication
 * This middleware runs before the page is rendered and can redirect unauthenticated users
 *
 * @param {import('next/server').NextRequest} req - The Next.js request object
 */
export async function middleware(req: NextRequest) {
    // Get the pathname of the request
    const path = req.nextUrl.pathname;

    // Define which paths are considered public (don't require authentication)
    const publicPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/api/auth",
    ];
    const isPublicPath = publicPaths.some(
        (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );

    // Check if the user is authenticated
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthenticated = !!token;

    // If the path is public, allow access regardless of authentication status
    if (isPublicPath) {
        return NextResponse.next();
    }

    // If the user is not authenticated and trying to access a protected route, redirect to login
    if (!isAuthenticated) {
        // Create the URL to redirect to with the original URL as a callback parameter
        const url = new URL("/login", req.url);
        url.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(url);
    }

    // If the user is authenticated and trying to access a protected route, allow access
    return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
    // Only run middleware on specific paths
    // Use regex patterns to define paths
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes that don't require authentication
         * 2. Static files (e.g., /favicon.ico, /images/*)
         * 3. Public assets (/_next/*)
         */
        "/((?!_next/static|_next/image|favicon.ico|images/|public/).*)",
    ],
};
