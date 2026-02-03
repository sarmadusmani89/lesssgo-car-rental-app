import styles from '@/app/(public)/how-it-works/how-it-works.module.css';

export default function HowItWorksHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>How It Works</h1>
                <p className={styles.subtitle}>
                    Renting a car with Lesssgo is simple, fast, and hassle-free.
                    Follow these easy steps to get on the road in no time.
                </p>
            </div>
        </section>
    );
}
