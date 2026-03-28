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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Support <span className="text-primary">Hub</span></h1>
                <p className="mt-2 text-slate-500 font-medium">We're here to help you 24/7 with your premium rental experience.</p>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-5 font-bold transition-all">
                        <Phone size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Call Us</h3>
                    <p className="mt-1.5 text-slate-500 font-medium text-sm">Direct line for immediate assistance and emergency roadside help.</p>
                    <a href={`tel:${settings?.contactPhone?.replace(/\s/g, '') || '+67583054576'}`} className="mt-4 inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline tracking-tight">
                        {settings?.contactPhone || '+675 8305 4576'} <ExternalLink size={14} />
                    </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-emerald-200">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-5">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">WhatsApp Chat</h3>
                    <p className="mt-1.5 text-slate-500 font-medium text-sm">Chat with our support team for quick queries and documentation.</p>
                    <a href={getWhatsAppLink(settings?.contactWhatsApp)} target="_blank" className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-bold text-sm hover:underline tracking-tight">
                        Chat Now <ExternalLink size={14} />
                    </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:border-primary/10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-5">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Email Support</h3>
                    <p className="mt-1.5 text-slate-500 font-medium text-sm">Official correspondence for inquiries and long-term rental bookings.</p>
                    <a href={`mailto:${settings?.contactEmail || 'ride@lessssgopng.com'}`} className="mt-4 inline-flex items-center gap-2 text-slate-900 font-bold text-sm hover:text-primary transition-colors tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                        {settings?.contactEmail || 'ride@lessssgopng.com'} <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Address Visual */}
            <div className="bg-slate-50 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100/50 shadow-sm group">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-primary transition-colors">
                        <MapPin size={28} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Location</h4>
                        <p className="text-lg font-bold text-slate-900 tracking-tight">{settings?.contactAddress || 'Port Moresby, Papua New Guinea'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* FAQs */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-[3px] bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Common Questions</h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:border-primary/20">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                >
                                    <span className={`font-semibold tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="pt-4 border-t border-slate-50 text-slate-500 font-medium text-sm leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Links */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-[3px] bg-slate-900 rounded-full" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Quick Info</h2>
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 space-y-6">
                        <Link href="/terms" className="flex items-center gap-4 group">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 group-hover:bg-primary group-hover:text-white transition-all">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary">Terms of Service</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Legal</p>
                            </div>
                        </Link>

                        <Link href="/privacy" className="flex items-center gap-4 group">
                            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 group-hover:bg-primary group-hover:text-white transition-all">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary">Privacy Policy</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protection</p>
                            </div>
                        </Link>

                        <div className="pt-6 border-t border-slate-100">
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Our platform operates under strict <strong className="text-slate-600">safety and insurance standards</strong> for every journey in PNG.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
