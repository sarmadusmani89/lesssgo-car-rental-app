'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from '@/app/(public)/about/about.module.css';

export default function AboutHero() {
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
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>About {siteName}</h1>
                <p className={styles.subtitle}>
                    Your trusted partner in premium car rentals. We're dedicated to making every journey memorable.
                </p>
            </div>
        </section>
    );
}
