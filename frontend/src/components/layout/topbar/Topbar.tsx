'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Bell, User, Menu } from 'lucide-react';
import styles from './Topbar.module.css';

interface TopbarProps {
    user?: {
        name: string;
        image?: string;
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
        <header className={styles.topbar}>
            {/* Left */}
            <div className="flex items-center gap-4">
                <button
                    className={styles.mobileMenuBtn}
                    onClick={onMenuClick}
                >
                    <Menu size={20} />
                </button>
                <h1 className={styles.title}>{title}</h1>
            </div>

            {/* Right */}
            <div className={styles.right}>
                {/* Notifications */}
                {/* Notifications - Hidden for now
                <button className={styles.notificationBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationDot}></span>
                </button>
                */}

                {/* User */}
                <div className="relative">
                    <button
                        className={`${styles.userWrapper} hover:bg-gray-50 transition rounded-lg p-2`}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className={styles.userText}>
                            <p className={styles.userName}>
                                {user?.name || 'Guest User'}
                            </p>
                        </div>

                        <div className={styles.avatar}>
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className={styles.avatarFallback}>
                                    {user?.name?.charAt(0) || <User size={18} />}
                                </div>
                            )}
                        </div>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-1 border z-50">
                            <Link
                                href="/dashboard/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowDropdown(false)}
                            >
                                View Profile
                            </Link>
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
