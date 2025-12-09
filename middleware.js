import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // Define protected routes
    const protectedPaths = ['/dashboard'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // Define auth routes (login, signup)
    const authPaths = ['/login', '/signup'];
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    // If trying to access protected route without token
    if (isProtectedPath) {
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Simple token existence check (full verification happens in API routes)
        // A valid JWT has 3 parts separated by dots
        const parts = token.split('.');
        if (parts.length !== 3) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.set('auth_token', '', { maxAge: 0 });
            return response;
        }
    }

    // If user has token and tries to access login/signup, redirect to dashboard
    if (isAuthPath && token) {
        const parts = token.split('.');
        if (parts.length === 3) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/signup',
    ],
};

