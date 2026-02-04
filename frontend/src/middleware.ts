import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // 1. Protect Admin Routes (Only Admins allowed)
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        if (role?.toLowerCase() !== 'admin') {
            // Logged in but not an admin -> Send to user dashboard
            return NextResponse.redirect(new URL('/dashboard/profile', request.url));
        }
    }

    // 2. Protect User Dashboard Routes (Only Regular Users allowed)
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
        if (role?.toLowerCase() === 'admin') {
            // Logged in as admin -> Send to admin dashboard
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    // 3. Prevent logged-in users from accessing Auth pages
    if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup')) {
        if (token) {
            if (role?.toLowerCase() === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
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
