"use client";

import { LucideIcon } from 'lucide-react';
import styles from '@/app/(public)/about/about.module.css';

interface ValueCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
    return (
        <div className={styles.valueCard}>
            <div className={styles.valueIcon}>
                <Icon size={40} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
