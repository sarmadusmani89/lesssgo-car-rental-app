'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X } from 'lucide-react';
import styles from './Sidebar.module.css';

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
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden}`}
                onClick={onClose}
            />

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed} ${className}`}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className={styles.closeBtn}
                >
                    <X size={20} />
                </button>
                {/* Top section */}
                <div>
                    <div className={styles.titleWrapper}>
                        <h2 className={styles.title}>{title}</h2>
                    </div>

                    <nav className={styles.nav}>
                        {links.map((link) => {
                            const isActive = activeTab ? activeTab === link.href : pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className={`group ${styles.link} ${isActive ? styles.linkActive : styles.linkInactive
                                        }`}
                                >
                                    <span
                                        className={`${styles.icon} ${isActive ? styles.iconActive : `${styles.iconInactive} group-hover:text-blue-500`
                                            }`}
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
                <div className={styles.logoutWrapper}>
                    <button
                        onClick={handleLogout}
                        className={`group ${styles.logoutButton}`}
                    >
                        <LogOut
                            size={20}
                            className="text-gray-400 group-hover:text-blue-500"
                        />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
