'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import styles from '@/app/(public)/about/about.module.css';
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
        <section className={styles.story}>
            <div className="container">
                <div className={styles.storyGrid}>
                    <div className={styles.storyContent}>
                        <h2>Our Story</h2>
                        <p>
                            Founded with a vision to revolutionize the car rental industry, {siteName} has grown from a small local service to a trusted name in premium car rentals.
                        </p>
                        <p>
                            We believe that renting a car should be simple, transparent, and enjoyable. That's why we've built a platform that combines cutting-edge technology with personalized service to deliver an unmatched rental experience.
                        </p>
                        <p>
                            Today, we proudly serve thousands of satisfied customers, offering a diverse fleet of well-maintained cars and exceptional customer support every step of the way.
                        </p>
                    </div>
                    <div className={styles.storyImage}>
                        <div className={styles.imagePlaceholder}>
                            <Users size={64} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
