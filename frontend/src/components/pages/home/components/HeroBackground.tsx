"use client";

import Image from 'next/image';
import styles from '@/app/(public)/(home)/page.module.css';

export default function HeroBackground() {
    return (
        <div className={styles.heroBackground}>
            <Image
                src="/images/hero_bg.png"
                alt="Luxury Car Background"
                fill
                priority
                quality={100}
            />
            <div className={styles.heroOverlay} />
        </div>
    );
}
