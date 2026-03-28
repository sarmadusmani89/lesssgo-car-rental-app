'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SidebarLink {
    name: string;
    href: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    title: string;
    links: SidebarLink[];
    className?: string;
    activeTab?: string;
    isOpen?: boolean;
    onClose?: () => void;
    onNavigate?: (href: string) => void;
}

export default function Sidebar({ title, links, className = '', activeTab, isOpen, onClose, onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear auth tokens
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push('/auth/login');
    };

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        if (onNavigate) {
            e.preventDefault();
            onNavigate(href);
        }
        if (onClose) onClose();
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`fixed top-0 left-0 h-screen w-64 bg-card/95 backdrop-blur-xl border-r border-border/50 flex flex-col justify-between shadow-2xl md:shadow-sm z-[60] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${className}`}>
                {/* Mobile Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute top-5 right-5 md:hidden"
                >
                    <X size={20} />
                </Button>
                {/* Top section */}
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold   bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{title}</h2>
                    </div>

                    <nav className="px-4 py-2 space-y-1">
                        {links.map((link) => {
                            const isActive = activeTab ? activeTab === link.href : pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1'
                                        : 'text-muted-foreground hover:bg-muted hover:text-accent hover:pl-5'
                                        }`}
                                >
                                    <span
                                        className={`transition-colors ${isActive ? 'text-primary-foreground' : 'text-muted-foreground/50 group-hover:text-accent'}`}
                                    >
                                        {link.icon}
                                    </span>
                                    <span className="text-[14px] tracking-wide">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50"
                    >
                        <LogOut
                            size={20}
                            className="mr-3 transition-colors"
                        />
                        <span className="text-[14px] tracking-wide">Logout</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}

