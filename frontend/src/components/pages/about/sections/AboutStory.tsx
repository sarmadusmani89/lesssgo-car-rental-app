'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users } from 'lucide-react';

export default function AboutStory() {
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
        <section className="py-24 md:py-32">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-8">Our Story</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            Founded with a vision to revolutionize the car rental industry, {siteName} has grown from a small local service to a trusted name in premium car rentals.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            We believe that renting a car should be simple, transparent, and enjoyable. That's why we've built a platform that combines cutting-edge technology with personalized service to deliver an unmatched rental experience.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            Today, we proudly serve thousands of satisfied customers, offering a diverse fleet of well-maintained cars and exceptional customer support every step of the way.
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="w-full aspect-square bg-gradient-to-br from-accent to-[#7c3aed] rounded-[2rem] flex items-center justify-center text-white shadow-2xl">
                            <Users size={80} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
