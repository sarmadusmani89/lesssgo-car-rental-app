import styles from '@/app/(public)/faq/faq.module.css';

export default function FAQHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>Frequently Asked Questions</h1>
                <p className={styles.subtitle}>
                    Find answers to common questions about our car rental service.
                </p>
            </div>
        </section>
    );
}
