'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function HowItWorksHero() {
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
        <section className="pt-44 pb-32 text-center bg-gradient-to-br from-slate-50 [background:linear-gradient(135deg,_#f8fafc_0%,_#e0e7ff_100%)]">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight">How It Works</h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Renting a car with {siteName} is simple, fast, and hassle-free.
                    Follow these easy steps to get on the road in no time.
                </p>
            </div>
        </section>
    );
}
