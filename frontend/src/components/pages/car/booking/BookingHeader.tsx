import { formatPrice } from '@/lib/utils';
import styles from './BookingHeader.module.css';

interface BookingHeaderProps {
    pricePerDay: number;
    currency: string;
    rates: any;
}

export default function BookingHeader({ pricePerDay, currency, rates }: BookingHeaderProps) {
    return (
        <div className={styles.header}>
            <span className={styles.subtitle}>
                Reserve Your Journey
            </span>
            <div className={styles.priceContainer}>
                <span className={styles.price}>
                    {formatPrice(pricePerDay, currency as any, rates)}
                </span>
                <span className={styles.unit}>/ day</span>
            </div>
        </div>
    );
}
