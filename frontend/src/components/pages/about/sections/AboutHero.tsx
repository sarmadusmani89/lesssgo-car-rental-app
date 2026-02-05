import styles from '@/app/(public)/about/about.module.css';

export default function AboutHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>About Lesssgo</h1>
                <p className={styles.subtitle}>
                    Your trusted partner in premium car rentals. We're dedicated to making every journey memorable.
                </p>
            </div>
        </section>
    );
}
