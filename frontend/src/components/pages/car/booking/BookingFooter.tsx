import styles from './BookingFooter.module.css';

export default function BookingFooter() {
    return (
        <p className={styles.footer}>
            You won't be charged yet. We'll check availability and confirm your booking instantly.
        </p>
    );
}
