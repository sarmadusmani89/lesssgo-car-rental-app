'use client';

import { Wrench, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MaintenancePage() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        // Fetch settings from the public API
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`)
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Failed to fetch settings:', err));
    }, []);

    const displayEmail = settings?.adminEmail || 'support@lesssgo.com';
    const displayPhone = settings?.phoneNumber || '+675 1234 5678';

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 animate-blob" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 animate-blob animation-delay-2000" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                {/* Icon */}
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100/50">
                    <Wrench className="w-12 h-12 text-blue-600" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">System Update</span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 font-outfit tracking-tight">
                        We are currently <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            Under Maintenance
                        </span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                        To serve you better, we're currently upgrading our platform. We appreciate your patience and promise it will be worth the wait.
                    </p>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto pt-8">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                            <Mail size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-gray-400 uppercase">Email Us</div>
                            <div className="text-sm font-bold text-gray-900">{displayEmail}</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                            <Phone size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-xs font-bold text-gray-400 uppercase">Call Support</div>
                            <div className="text-sm font-bold text-gray-900">{displayPhone}</div>
                        </div>
                    </div>
                </div>

                {/* Admin Link (Subtle) */}
                <div className="pt-12">
                    <Link href="/auth/login" className="text-gray-400 hover:text-blue-600 text-sm font-medium transition-colors">
                        Admin Access
                    </Link>
                </div>
            </div>

            <style>
                {`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                `}
            </style>
        </div>
    );
}
