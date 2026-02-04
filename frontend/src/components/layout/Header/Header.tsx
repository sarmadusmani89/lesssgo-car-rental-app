'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Car, User, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        // Check for user in localStorage
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage events (logout/login in other tabs)
        window.addEventListener('storage', checkUser);

        // Listen for custom 'auth-change' event (if we implement dispatchEvent in login/logout)
        // For now, simpler to just rely on mount or maybe an interval if needed, but storage event covers cross-tab.
        // For single-tab updates, we might need to dispatch an event or use context.
        // Let's rely on the fact that login usually redirects, which re-mounts or at least triggers checks if we navigate.
        // Since Next.js navigation is client-side, purely relying on mount might not be enough if we just push state.
        // But typically a full login flow involves a router.push which re-renders. 

        return () => {
            window.removeEventListener('storage', checkUser);
        };
    }, [pathname]); // Re-check on path change (e.g. after login redirect)

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

    return (
        <header className={styles.header}>
            <div className={`container ${styles.nav}`}>
                <Link href="/" className={styles.logo}>
                    <Car size={32} className={styles.logoIcon} />
                    <span>Lesssgo</span>
                </Link>

                <nav className={styles.desktopNav}>
                    <Link href="/cars">Find Cars</Link>
                    <Link href="/how-it-works">How it Works</Link>
                    <Link href="/about">About Us</Link>
                </nav>

                <div className={styles.actions}>
                    <div className={styles.desktopOnly}>
                        {user ? (
                            <Link href={dashboardLink} className="btn btn-primary flex items-center gap-2">
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-outline">Log in</Link>
                                <Link href="/auth/signup" className="btn btn-primary">Sign up</Link>
                            </>
                        )}
                    </div>
                    <button className={styles.mobileMenu} onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.mobileDrawerOpen : ''}`}>
                <nav className={styles.mobileNav}>
                    <Link href="/cars" onClick={() => setIsMenuOpen(false)}>Find Cars</Link>
                    <Link href="/how-it-works" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <div className={styles.mobileAuth}>
                        {user ? (
                            <Link href={dashboardLink} className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-outline w-full" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                                <Link href="/auth/signup" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* Overlay */}
            {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}
        </header>
    );
}
