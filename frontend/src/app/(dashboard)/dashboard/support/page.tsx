"use client";

import Link from 'next/link';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    LifeBuoy,
    MessageCircle,
    Phone,
    Mail,
    ChevronDown,
    ExternalLink,
    MessageSquare,
    ShieldCheck,
    FileText,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
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

    const faqs = [
        {
            q: "How do I cancel my booking?",
            a: "You can cancel your booking directly from the 'My Bookings' section. Cancellations made more than 48 hours before the pickup time are eligible for a full refund."
        },
        {
            q: "What documents do I need for pickup?",
            a: "You'll need a valid driver's license, a passport (for international travelers), and the credit card used for the booking. For Cash on Pickup, please bring the exact amount in AUD or PGK."
        },
        {
            q: "Is insurance included in the price?",
            a: "Basic insurance is included in all our daily rates. This covers third-party liability. You can upgrade to Full Damage Waiver (FDW) at the time of pickup."
        },
        {
            q: "Can I extend my rental period?",
            a: "Yes, extensions are possible depending on vehicle availability. Please contact us at least 24 hours before your scheduled drop-off time."
        }
    ];

    // Helper for WhatsApp link
    const getWhatsAppLink = (phone?: string) => {
        const defaultPhone = '67583054576';
        if (!phone) return `https://wa.me/${defaultPhone}`;
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone || defaultPhone}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support <span className="text-primary">Hub</span></h1>
                <p className="text-slate-500 mt-1 font-medium">We're here to help you 24/7 with your premium rental experience.</p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-5">
                        <Phone size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Call Us</h3>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">Available 24/7 for emergency roadside assistance.</p>
                    <a href={`tel:${settings?.contactPhone?.replace(/\s/g, '') || '+67583054576'}`} className="text-slate-900 font-black text-base mt-4 block hover:text-primary transition-colors">
                        {settings?.contactPhone || '+675 8305 4576'}
                    </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">WhatsApp Chat</h3>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">Chat with our concierge team for quick queries.</p>
                    <a href={getWhatsAppLink(settings?.contactWhatsApp)} target="_blank" className="text-emerald-600 font-bold text-sm mt-4 block hover:underline">Open WhatsApp</a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-5">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Email Support</h3>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">For non-urgent inquiries and documentation.</p>
                    <a href={`mailto:${settings?.contactEmail || 'ride@lessssgopng.com'}`} className="text-slate-900 font-bold text-sm mt-4 block hover:text-indigo-600 transition-colors">
                        {settings?.contactEmail || 'ride@lessssgopng.com'}
                    </a>
                </div>
            </div>

            {/* Address Section */}
            <div className="bg-slate-50/50 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 border border-slate-100/50 shadow-sm transition-all hover:border-primary/10 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-primary transition-colors">
                    <MapPin size={28} />
                </div>
                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Our Office</h4>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{settings?.contactAddress || 'Port Moresby, Papua New Guinea'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Questions & <span className="text-primary">Answers</span></h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:border-primary/20 group">
                                <Button
                                    variant="ghost"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all h-auto rounded-none border-none hover:bg-transparent`}
                                >
                                    <span className={`font-bold tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900'}`}>{faq.q}</span>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </Button>
                                {openFaq === index && (
                                    <div className="px-6 pb-5 text-slate-500 text-sm font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
                                        <div className="pt-2 border-t border-slate-50">
                                            {faq.a}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Helpful Links */}
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Resources</h2>
                    <div className="bg-slate-50/50 rounded-3xl p-6 space-y-6 border border-slate-100/50">
                        <Link href="/terms" className="flex items-center gap-4 group">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white shadow-sm border border-slate-50 transition-all">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary">Terms of Service</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Policies</p>
                            </div>
                        </Link>

                        <Link href="/privacy" className="flex items-center gap-4 group">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white shadow-sm border border-slate-50 transition-all">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary">Privacy Policy</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protection</p>
                            </div>
                        </Link>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                            <p className="text-[11px] text-slate-400 font-medium leading-tight">
                                Compliance with <strong className="text-slate-600">PNG Transport Authority</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
