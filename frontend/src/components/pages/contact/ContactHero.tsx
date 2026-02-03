import styles from '@/app/(public)/contact/contact.module.css';

export default function ContactHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <h1 className={styles.title}>Get In Touch</h1>
                <p className={styles.subtitle}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>
        </section>
    );
}
