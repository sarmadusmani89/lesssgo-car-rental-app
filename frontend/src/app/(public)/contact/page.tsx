'use client';

import styles from './contact.module.css';
import ContactHero from '@/components/pages/contact/sections/ContactHero';
import ContactInfo from '@/components/pages/contact/sections/ContactInfo';
import ContactForm from '@/components/pages/contact/sections/ContactForm';

export default function ContactPage() {
    return (
        <div className={`${styles.container} py-20 md:py-32`}>
            <ContactHero />

            <section className={styles.content}>
                <div className="container">
                    <div className={styles.grid}>
                        <ContactInfo />
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
