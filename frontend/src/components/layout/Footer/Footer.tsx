import Link from 'next/link';
import styles from './Footer.module.css';
import { Car, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.brand}>
                    <Link href="/" className={styles.logo}>
                        <Car size={32} />
                        <span>Lesssgo</span>
                    </Link>
                    <p>Experience the ultimate freedom on the road with Lesssgo. We provide premium car rental services at competitive prices.</p>
                    <div className={styles.socials}>
                        <Link href="#" className={styles.socialIcon}><Instagram size={20} /></Link>
                        <Link href="#" className={styles.socialIcon}><Twitter size={20} /></Link>
                        <Link href="#" className={styles.socialIcon}><Facebook size={20} /></Link>
                    </div>
                </div>

                <div>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link href="/cars">Find Cars</Link></li>
                        <li><Link href="/how-it-works">How it Works</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>Support</h3>
                    <ul>
                        <li><Link href="/faq">FAQs</Link></li>
                        <li><Link href="/terms">Terms & Conditions</Link></li>
                        <li><Link href="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h3>Contact Us</h3>
                    <ul>
                        <li style={{ display: 'flex', gap: '8px', color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
                            <MapPin size={18} />
                            <span>1234 Sports Car Blvd, Beverly Hills, CA 90210</span>
                        </li>
                        <li style={{ display: 'flex', gap: '8px', color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
                            <Phone size={18} />
                            <span>+1 (555) 123-4567</span>
                        </li>
                        <li style={{ display: 'flex', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                            <Mail size={18} />
                            <span>hello@lesssgo.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Lesssgo. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
