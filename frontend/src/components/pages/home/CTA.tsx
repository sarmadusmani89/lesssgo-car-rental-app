import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from '@/app/(public)/(home)/page.module.css';

export default function CTA() {
    return (
        <section className={styles.ctaSection}>
            <div className={styles.ctaBackground}>
                <Image
                    src="/images/light-theme-luxury-car-bg.png"
                    alt="Luxury Car Background"
                    fill
                    quality={100}
                />
            </div>
            <div className={styles.ctaOverlay} />

            <div className="container">
                <div className={styles.ctaContent}>
                    <div className={styles.ctaText}>
                        <h2 className={styles.ctaTitle}>Can't Find What You're Looking For?</h2>
                        <p className={styles.ctaDescription}>Let our specialists help you find your perfect car. We have access to exclusive inventory and can source any luxury car you desire.</p>
                    </div>

                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className={styles.btnPrimary}>
                            Contact Us <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
