"use client";

import styles from './Newsletter.module.css';

export default function Newsletter() {
    return (
        <section className={styles.newsletter}>
            <div className="container">
                <div className={styles.newsletterContent}>
                    <div className={styles.textSection}>
                        <h2>Join the Exclusive Club</h2>
                        <p>Get priority access to new arrivals, special offers, and invite-only events.</p>
                    </div>
                    <form className={styles.formSection} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className={styles.input}
                                required
                            />
                            <button type="submit" className={styles.submitBtn}>
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
