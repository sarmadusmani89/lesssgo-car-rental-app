import styles from '@/app/(public)/terms/terms.module.css';

export default function TermsHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>Terms & Conditions</h1>
                <p className={styles.lastUpdated}>Last Updated: February 3, 2026</p>
            </div>
        </section>
    );
}
