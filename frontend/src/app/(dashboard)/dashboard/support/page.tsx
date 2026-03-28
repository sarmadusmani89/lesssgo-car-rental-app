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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-16">
            <div className="text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter sm:text-5xl uppercase">
                    Support <span className="text-primary">Hub</span>
                </h1>
                <p className="mt-3 text-sm font-bold text-slate-400 max-w-2xl uppercase tracking-[0.2em]">
                    Premium Concierge Support — Available 24/7 for your Pacific Journey.
                </p>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-primary/20">
                    <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <Phone size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Call Concierge</h3>
                    <p className="mt-2 text-slate-500 font-medium text-sm leading-relaxed">Direct line to our Port Moresby dispatch for immediate roadside assistance.</p>
                    <a href={`tel:${settings?.contactPhone?.replace(/\s/g, '') || '+67583054576'}`} className="mt-6 inline-flex items-center gap-2 text-primary font-black text-lg hover:gap-3 transition-all tracking-tight">
                        {settings?.contactPhone || '+675 8305 4576'} <ExternalLink size={18} />
                    </a>
                </div>

                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-200">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp Chat</h3>
                    <p className="mt-2 text-slate-500 font-medium text-sm leading-relaxed">Real-time chat with our support team for documentation and quick queries.</p>
                    <a href={getWhatsAppLink(settings?.contactWhatsApp)} target="_blank" className="mt-6 inline-flex items-center gap-2 text-emerald-600 font-black text-lg hover:gap-3 transition-all tracking-tight">
                        Chat Now <ExternalLink size={18} />
                    </a>
                </div>

                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200">
                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Mail size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Email Support</h3>
                    <p className="mt-2 text-slate-500 font-medium text-sm leading-relaxed">Official correspondence for business bookings and long-term rental inquiries.</p>
                    <a href={`mailto:${settings?.contactEmail || 'ride@lessssgopng.com'}`} className="mt-6 inline-flex items-center gap-2 text-blue-600 font-black text-lg hover:gap-3 transition-all tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                        {settings?.contactEmail || 'ride@lessssgopng.com'} <ExternalLink size={18} />
                    </a>
                </div>
            </div>

            {/* Address Visual */}
            <div className="relative bg-slate-900 p-8 rounded-[2.5rem] overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-primary/20" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-primary backdrop-blur-sm border border-white/10">
                            <MapPin size={40} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-1">HQ Location</h4>
                            <p className="text-2xl font-black text-white tracking-tight">{settings?.contactAddress || 'Port Moresby, Papua New Guinea'}</p>
                        </div>
                    </div>
                    <Button variant="accent" className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl px-10 py-6 h-auto text-sm font-black uppercase tracking-widest">
                        Get Directions
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* FAQs */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-[4px] bg-primary rounded-full" />
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Frequently <span className="text-primary">Asked</span></h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-100">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-lg font-black tracking-tight transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
                                        {faq.q}
                                    </span>
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${openFaq === index ? 'bg-primary text-white rotate-180 shadow-lg shadow-primary/30' : 'bg-slate-50 text-slate-400'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                {openFaq === index && (
                                    <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                                        <div className="pt-6 border-t border-slate-50 text-slate-500 font-medium text-base leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Links */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-[4px] bg-slate-900 rounded-full" />
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Legal</h2>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-10">
                        <Link href="/terms" className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary transition-colors">Terms</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Rental Policies</p>
                            </div>
                        </Link>

                        <Link href="/privacy" className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary transition-colors">Privacy</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Data Protection</p>
                            </div>
                        </Link>

                        <div className="pt-10 border-t border-slate-200">
                            <div className="flex items-center gap-3 text-slate-400 mb-4">
                                <LifeBuoy size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Compliant Platform</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Operated under strict <strong className="text-slate-600">independent safety standards</strong> for all rentals in Papua New Guinea.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
