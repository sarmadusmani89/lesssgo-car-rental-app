'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Bell, Search, User } from 'lucide-react';
import styles from './Topbar.module.css';

interface TopbarProps {
    user?: {
        name: string;
        image?: string;
    };
    title?: string;
}

export default function Topbar({ user, title }: TopbarProps) {
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
            <div>
                <h1 className={styles.title}>{title || 'Dashboard'}</h1>
            </div>

            {/* Right */}
            <div className={styles.right}>
                {/* Search */}
                <div className={`${styles.searchWrapper} group`}>
                    <Search
                        size={20}
                        className={`${styles.searchIcon} group-focus-within:text-blue-500`}
                    />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className={styles.searchInput}
                    />
                </div>

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
