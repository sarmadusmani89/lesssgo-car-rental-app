'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';

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
                className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`fixed top-0 left-0 h-screen w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 flex flex-col justify-between shadow-2xl md:shadow-sm z-[60] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${className}`}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 md:hidden transition-all duration-200"
                >
                    <X size={20} />
                </button>
                {/* Top section */}
                <div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{title}</h2>
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
                                        ? 'bg-primary text-white shadow-lg shadow-black/10 translate-x-1' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-accent hover:pl-5'
                                    }`}
                                >
                                    <span
                                        className={`transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-accent'}`}
                                    >
                                        {link.icon}
                                    </span>
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="px-4 py-4">
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut
                            size={20}
                            className="text-gray-400 group-hover:text-red-600"
                        />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

