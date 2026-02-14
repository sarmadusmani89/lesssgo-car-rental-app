'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from '@/app/(public)/how-it-works/how-it-works.module.css';

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
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>How It Works</h1>
                <p className={styles.subtitle}>
                    Renting a car with {siteName} is simple, fast, and hassle-free.
                    Follow these easy steps to get on the road in no time.
                </p>
            </div>
        </section>
    );
}
