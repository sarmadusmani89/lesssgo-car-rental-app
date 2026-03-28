'use client';

import Sidebar from '@/components/layout/sidebar/Sidebar';
import Topbar from '@/components/layout/topbar/Topbar';
import { LogOut } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebarTitle: string;
    topbarTitle?: string;
    userName?: string;
    userRole?: string;
    links: Array<{
        name: string;
        href: string;
        icon: React.ReactNode;
    }>;
}

export default function DashboardLayout({
    children,
    sidebarTitle,
    userName = 'User',
    userRole = 'USER',
    links,
}: DashboardLayoutProps) {
    const sidebarWidth = 256; // Sidebar width in px

    const handleLogout = () => {
        // Clear auth tokens
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Trigger storage event for other components (like Header)
        window.dispatchEvent(new Event('storage'));

        window.location.href = '/auth/login';
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 flex flex-col justify-between bg-card border-r border-border z-20 shadow-sm">
                <Sidebar
                    title={sidebarTitle}
                    links={links}
                    className="flex-1"
                />

                {/* Logout */}
                <div className="px-4 py-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-accent transition group"
                    >
                        <LogOut size={20} className="text-muted-foreground group-hover:text-accent transition-colors" />
                        <span className="font-bold uppercase text-xs tracking-widest">Logout</span>
                    </button>
                </div>
            </div>


            {/* Main content */}
            <div
                className="flex-1 flex flex-col min-w-0"
                style={{ marginLeft: sidebarWidth }}
            >
                <Topbar user={{ name: userName, role: userRole }} />
                <main className="flex-1 p-8 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
