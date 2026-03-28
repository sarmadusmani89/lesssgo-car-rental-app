'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SessionProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const validateSession = async () => {
            const user = localStorage.getItem('user');
            if (!user) return;

            try {
                // Ping the profile endpoint to verify the token
                await api.get('/users/profile');
            } catch (error: any) {
                // If the token is invalid (401), clear the local storage
                if (error.response?.status === 401) {
                    console.log("Session expired or invalid. Clearing local state.");
                    localStorage.removeItem('user');
                    // Dispatch an event so components (like Header) can re-sync
                    window.dispatchEvent(new Event('auth-logout'));
                    
                    // If on a protected route, redirect to login
                    if (pathname.includes('/admin') || pathname.includes('/dashboard')) {
                        router.push('/auth/login');
                    }
                }
            }
        };

        validateSession();
    }, [pathname, router]);

    return <>{children}</>;
}
