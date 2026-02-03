'use client';

import styles from './contact.module.css';
import ContactHero from '@/components/pages/contact/ContactHero';
import ContactInfo from '@/components/pages/contact/ContactInfo';
import ContactForm from '@/components/pages/contact/ContactForm';

export default function ContactPage() {
    return (
        <div className={styles.container}>
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
