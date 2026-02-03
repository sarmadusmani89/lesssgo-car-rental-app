import Link from 'next/link';
import styles from '@/app/(public)/how-it-works/how-it-works.module.css';

export default function HowItWorksCTA() {
    return (
        <section className={styles.cta}>
            <div className="container">
                <h2>Ready to Get Started?</h2>
                <p>Browse our fleet and find your perfect car today</p>
                <Link href="/cars" className="btn btn-primary btn-lg">
                    View All Cars
                </Link>
            </div>
        </section>
    );
}
