import Link from 'next/link';
import styles from '@/app/(public)/faq/faq.module.css';

export default function FAQCTA() {
    return (
        <section className={styles.cta}>
            <div className="container">
                <h2>Still have questions?</h2>
                <p>Can't find the answer you're looking for? Please contact our support team.</p>
                <Link href="/contact" className="btn btn-primary btn-lg">
                    Contact Us
                </Link>
            </div>
        </section>
    );
}
