import styles from '@/app/(public)/privacy/privacy.module.css';

export default function PrivacyHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: February 3, 2026</p>
            </div>
        </section>
    );
}
