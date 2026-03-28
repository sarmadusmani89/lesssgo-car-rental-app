'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Bell, User, Menu, Search } from 'lucide-react';

interface TopbarProps {
    user?: {
        name: string;
        image?: string;
        role?: string;
    };
    title?: string;
    onMenuClick?: () => void;
}

export default function Topbar({ user, title, onMenuClick }: TopbarProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        // Clear auth tokens
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push('/auth/login');
    };

    return (
        <header className="h-20 w-full sticky top-0 z-10 bg-white border-b border-gray-200/50 flex items-center justify-between px-4 md:px-8 shadow-sm overflow-hidden z-50">
            {/* Left */}
            <div className="flex items-center gap-4 min-w-0">
                <button
                    className="flex md:hidden p-2 rounded-xl text-gray-800 hover:bg-gray-100 transition"
                    onClick={onMenuClick}
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate min-w-0">{title}</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
                {/* Search - Hidden for now */}
                {/* 
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-gray-200 bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent focus:bg-white"
                    />
                </div>
                */}

                {/* Notifications - Hidden for now */}
                {/* 
                <button className="p-2.5 rounded-xl text-gray-500 hover:bg-accent/10 hover:text-accent relative transition-all">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
                */}

                {/* User */}
                <div className="relative">
                    <button
                        className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 transition rounded-lg p-2"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.name || 'Guest User'}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                                {user?.role || 'User'}
                            </p>
                        </div>

                        <div className="h-10 w-10 rounded-full ring-2 ring-white shadow-md overflow-hidden cursor-pointer flex items-center justify-center transition-all">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0) || <User size={18} />}
                                </div>
                            )}
                        </div>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-1 border z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                            {user?.role !== 'ADMIN' && (
                                <Link
                                    href="/dashboard/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    View Profile
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

