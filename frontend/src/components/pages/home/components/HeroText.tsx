"use client";

import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import styles from '@/app/(public)/(home)/page.module.css';

export default function HeroText() {
    return (
        <div className={`${styles.heroText} animate-fade-in`}>
            <h1>
                Elevate Your <br />
                <span className="gradient-text">Journey</span>
            </h1>
            <p>
                Experience the thrill of driving the world's most exclusive
                supercars. Curated for the discerning few.
            </p>

            <div className={styles.heroActions}>
                <Link href="/cars" className="btn btn-primary btn-lg">
                    Browse Cars <ArrowRight size={20} />
                </Link>
                <div className={styles.playButtonWrapper}>
                    <button className={styles.playButton}>
                        <Play size={20} fill="currentColor" />
                    </button>
                    <span>Watch Film</span>
                </div>
            </div>
        </div>
    );
}
