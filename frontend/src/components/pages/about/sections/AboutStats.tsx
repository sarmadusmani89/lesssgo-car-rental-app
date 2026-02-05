"use client";

import styles from '@/app/(public)/about/about.module.css';
import StatCard from '../components/StatCard';

const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Premium Cars' },
    { value: '50+', label: 'Locations' },
    { value: '99%', label: 'Satisfaction Rate' },
];

export default function AboutStats() {
    return (
        <section className={styles.stats}>
            <div className="container">
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
