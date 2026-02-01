'use client';

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
                <button className={styles.notificationBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationDot}></span>
                </button>

                {/* User */}
                <div className={styles.userWrapper}>
                    <div className={styles.userText}>
                        <p className={styles.userName}>
                            {user?.name || 'Guest User'}
                        </p>
                        <p className={styles.userAction}>View Profile</p>
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
                </div>
            </div>
        </header>
    );
}
