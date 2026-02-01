'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
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
}

export default function Sidebar({ title, links, className = '' }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // clear auth tokens here if needed
        router.push('/login');
    };

    return (
        <aside className={`${styles.sidebar} ${className}`}>
            {/* Top section */}
            <div>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>{title}</h2>
                </div>

                <nav className={styles.nav}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group ${styles.link} ${
                                    isActive ? styles.linkActive : styles.linkInactive
                                }`}
                            >
                                <span
                                    className={`${styles.icon} ${
                                        isActive ? styles.iconActive : styles.iconInactive
                                    } group-hover:text-blue-500`}
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
    );
}
