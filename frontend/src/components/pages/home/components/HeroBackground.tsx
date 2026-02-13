"use client";

import Image from 'next/image';
import styles from '@/app/(public)/(home)/page.module.css';

export default function HeroBackground() {
    return (
        <div className={styles.heroBackground}>
            <Image
                src="/images/hero-background.png"
                alt="Haval Jolion Pro"
                fill
                priority
                quality={100}
            />
            <div className={styles.heroOverlay} />
        </div>
    );
}
