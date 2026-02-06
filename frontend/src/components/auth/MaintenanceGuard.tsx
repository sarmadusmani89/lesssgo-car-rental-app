'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const checkMaintenance = async () => {
            try {
                // 1. Fetch Settings
                const { data } = await api.get('/settings');
                const isActive = data.maintenanceMode;
                setMaintenanceMode(isActive);

                // 2. Check User Role
                const storedUser = localStorage.getItem('user');
                let user = null;
                if (storedUser) {
                    try {
                        user = JSON.parse(storedUser);
                    } catch (e) {
                        console.error("User parse error", e);
                    }
                }

                const isAdmin = user?.role === 'ADMIN';

                // 3. Define Logic
                const isMaintenancePage = pathname === '/maintenance';
                const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/admin/login');

                if (isActive) {
                    // Maintenance is ON
                    if (isAdmin) {
                        // Admin can go anywhere
                        if (isMaintenancePage) {
                            // Optional: Redirect admin away from maintenance page to dashboard? 
                            // Or let them see it. Let's let them see it if they want.
                        }
                        setIsAllowed(true);
                    } else if (isAuthPage) {
                        // Allow login so admins can get in
                        setIsAllowed(true);
                    } else {
                        // Not Admin, Not Auth Page -> Redirect to Maintenance
                        if (!isMaintenancePage) {
                            router.replace('/maintenance');
                            return; // Don't setAllowed yet
                        }
                        setIsAllowed(true); // Is on maintenance page
                    }
                } else {
                    // Maintenance is OFF
                    if (isMaintenancePage) {
                        // Shouldn't be on maintenance page if mode is off
                        router.replace('/');
                        return;
                    }
                    setIsAllowed(true);
                }

            } catch (error) {
                console.error("Failed to check maintenance mode", error);
                // Fallback: If check fails, allow access (better to stay up than go down if API fails)
                // Or deny? Usually allow.
                setIsAllowed(true);
            } finally {
                setLoading(false);
            }
        };

        checkMaintenance();
        // Poll every minute or listen to route changes?
        // Route changes trigger re-render of layout, but creating this simple check on mount is good start.
        // Adding pathname dependency to re-check on navigation.
    }, [pathname, router]);

    if (loading) {
        // Can show a splash screen or just null (white screen flash)
        // A minimal loader is safer
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (!isAllowed) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
