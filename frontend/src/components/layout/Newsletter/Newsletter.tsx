"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { newsletterApi } from '@/lib/api';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await newsletterApi.subscribe(email);
            toast.success('Joined the club!', {
                description: 'You are now on the list for exclusive updates.'
            });
            setEmail('');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to join. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.newsletter}>
            <div className="container">
                <div className={styles.newsletterContent}>
                    <div className={styles.textSection}>
                        <h2>Join the Exclusive Club</h2>
                        <p>Get priority access to new arrivals, special offers, and invite-only events.</p>
                    </div>
                    <form className={styles.formSection} onSubmit={handleSubscribe}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className={styles.input}
                                required
                            />
                            <button type="submit" disabled={loading} className={styles.submitBtn}>
                                {loading ? 'Joining...' : 'Subscribe'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
