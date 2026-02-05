"use client";

import Link from 'next/link';

import {
    LifeBuoy,
    MessageCircle,
    Phone,
    Mail,
    ChevronDown,
    ExternalLink,
    MessageSquare,
    ShieldCheck,
    FileText
} from 'lucide-react';
import { useState } from 'react';

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

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

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">Support Center</h1>
                <p className="text-gray-500 mt-1">We're here to help you 24/7 with your premium rental experience.</p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-200 transition">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Phone size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-outfit">Call Us</h3>
                    <p className="text-gray-500 text-sm mt-2">Available 24/7 for emergency roadside assistance.</p>
                    <a href="tel:+67572497905" className="text-blue-600 font-bold mt-4 block">+675 7249 7905</a>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-200 transition">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-outfit">WhatsApp</h3>
                    <p className="text-gray-500 text-sm mt-2">Chat with our concierge team for quick queries.</p>
                    <a href="https://wa.me/67572497905" target="_blank" className="text-indigo-600 font-bold mt-4 block">Open WhatsApp</a>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:border-violet-200 transition">
                    <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-6">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-outfit">Email Support</h3>
                    <p className="text-gray-500 text-sm mt-2">For non-urgent inquiries and documentation.</p>
                    <a href="mailto:cube360png@gmail.com" className="text-violet-600 font-bold mt-4 block">cube360png@gmail.com</a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 transition"
                                >
                                    <span className="font-bold text-gray-900">{faq.q}</span>
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Helpful Links */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">Helpful Resources</h2>
                    <div className="bg-gray-50 rounded-3xl p-8 space-y-6">
                        <Link href="/terms" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Terms of Service</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Rental Policies</p>
                            </div>
                        </Link>

                        <Link href="/privacy" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Privacy Policy</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Data Protection</p>
                            </div>
                        </Link>

                        <div className="pt-6 mt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                                Lesssgo Car Rental operates in compliance with PNG Transport Authority regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
