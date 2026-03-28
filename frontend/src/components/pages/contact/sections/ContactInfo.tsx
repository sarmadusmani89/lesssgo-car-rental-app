'use client';

import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactInfoItem from '../components/ContactInfoItem';
import api from '@/lib/api';

export default function ContactInfo() {
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

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            content: settings?.contactAddress || '1234 Sports Car Blvd, Beverly Hills, CA 90210',
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: settings?.contactPhone || '+675 83054576',
        },
        {
            icon: Mail,
            title: 'Email Us',
            content: settings?.contactEmail || 'ride@lessssgopng.com',
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary mb-4">Contact Information</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="flex flex-col gap-8">
                {contactInfo.map((item, index) => (
                    <ContactInfoItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
}
