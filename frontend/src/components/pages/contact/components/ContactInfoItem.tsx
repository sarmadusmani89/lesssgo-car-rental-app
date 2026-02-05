"use client";

import { LucideIcon } from 'lucide-react';
import styles from '@/app/(public)/contact/contact.module.css';

interface ContactInfoItemProps {
    icon: LucideIcon;
    title: string;
    content: string;
}

export default function ContactInfoItem({ icon: Icon, title, content }: ContactInfoItemProps) {
    return (
        <div className={styles.contactItem}>
            <div className={styles.contactIcon}>
                <Icon size={24} />
            </div>
            <div>
                <div className={styles.contactTitle}>{title}</div>
                <div className={styles.contactContent}>{content}</div>
            </div>
        </div>
    );
}
