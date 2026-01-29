import Link from 'next/link';
import styles from './Header.module.css';
import { Car, Search, User, Menu } from 'lucide-react';

export default function Header() {
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
                    <button className={styles.searchBtn}>
                        <Search size={20} />
                    </button>
                    <Link href="/auth/login" className="btn btn-outline">Log in</Link>
                    <Link href="/auth/signup" className="btn btn-primary">Sign up</Link>
                    <button className={styles.mobileMenu}>
                        <Menu size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
