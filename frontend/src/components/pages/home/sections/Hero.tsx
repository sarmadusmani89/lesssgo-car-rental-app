"use client";

import styles from '@/app/(public)/(home)/page.module.css';
import HeroBackground from '../components/HeroBackground';
import HeroFilter from '../components/HeroFilter';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <HeroBackground />
            <div className="container">
                <div className={styles.heroContent}>
                    <HeroFilter />
                </div>
            </div>
        </section>
    );
}
