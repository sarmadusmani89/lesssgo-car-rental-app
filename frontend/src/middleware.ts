import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // 1. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard/profile', request.url));
        }
    }

    // 2. Protect User Dashboard Routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 3. Redirect logged-in users away from auth pages
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
        if (token) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin/bookings', request.url));
            } else {
                return NextResponse.redirect(new URL('/dashboard/profile', request.url));
            }
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/login', '/auth/signup'],
};
