"use client";

import styles from '@/app/(public)/about/about.module.css';

interface StatCardProps {
    value: string;
    label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}
