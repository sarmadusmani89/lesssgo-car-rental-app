'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Instagram, Twitter, Facebook, Linkedin, Mail, MapPin, Phone, ArrowRight, Car } from 'lucide-react';

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const siteName = settings?.siteName || 'Lesssgo';

    return (
        <footer className="bg-primary text-white pt-24 mt-0 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 lg:gap-24 pb-24">
                <div className="flex flex-col gap-8">
                    <Link href="/" className="flex items-center gap-3 text-3xl font-extrabold text-primary-foreground tracking-tight lowercase">
                        <img src="/web-logo-dark.png" alt="Lesssgo Logo" className="h-20 w-auto object-contain" />
                    </Link>
                    <p className="text-primary-foreground/60 text-lg leading-relaxed max-w-[320px]">
                        Experience the ultimate freedom on the road with {siteName}. We provide premium car rental services at competitive prices.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a 
                                key={i} 
                                href="#" 
                                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 text-primary-foreground/60 border border-white/5 transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-lg"
                            >
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-8 text-primary-foreground">Quick Links</h3>
                    <ul className="flex flex-col gap-4">
                        {['Find Cars', 'How it Works', 'About Us', 'Contact'].map((item) => (
                            <li key={item}>
                                <Link 
                                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="text-primary-foreground/60 text-base transition-all duration-200 hover:text-accent hover:pl-1 font-medium"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-8 text-primary-foreground">Support</h3>
                    <ul className="flex flex-col gap-4">
                        {['FAQ', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                            <li key={item}>
                                <Link 
                                    href={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                    className="text-primary-foreground/60 text-base transition-all duration-200 hover:text-accent hover:pl-1 font-medium"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold mb-8 text-primary-foreground">Contact Us</h3>
                    <ul className="flex flex-col gap-5">
                        <li className="flex gap-3 text-primary-foreground/60 text-sm font-medium">
                            <MapPin size={18} className="text-accent shrink-0" />
                            <span>{settings?.contactAddress || '1234 Sports Car Blvd, Beverly Hills, CA 90210'}</span>
                        </li>
                        <li className="flex gap-3 text-primary-foreground/60 text-sm font-medium">
                            <Phone size={18} className="text-accent shrink-0" />
                            <span>{settings?.contactPhone || '+675 83054576'}</span>
                        </li>
                        <li className="flex gap-3 text-primary-foreground/60 text-sm font-medium">
                            <Mail size={18} className="text-accent shrink-0" />
                            <span>{settings?.contactEmail || 'ride@lessssgopng.com'}</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="py-10 bg-black/20 text-center text-sm text-primary-foreground/40 border-t border-white/5">
                <div className="container">
                    <p className="font-medium">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

