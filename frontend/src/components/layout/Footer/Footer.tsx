'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner'; // Changed from react-hot-toast to sonner
import api from '@/lib/api'; // New import for API utility
import styles from './Footer.module.css';
import { Instagram, Twitter, Facebook, Linkedin, Mail, MapPin, Phone, ArrowRight, Car } from 'lucide-react'; // Updated lucide-react imports

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Replace with your actual API endpoint for newsletter subscription
            const response = await fetch('/api/subscribe-newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Subscribed successfully!');
                setEmail(''); // Clear email input on success
            } else {
                toast.error(data.message || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            toast.error('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

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
