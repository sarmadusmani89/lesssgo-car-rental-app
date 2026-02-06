import { formatPrice } from '@/lib/utils';
import styles from './PriceSummary.module.css';

interface PriceSummaryProps {
    days: number;
    total: number;
    currency: string;
    rates: any;
}

export default function PriceSummary({ days, total, currency, rates }: PriceSummaryProps) {
    if (total <= 0) return null;

    return (
        <div className={styles.summary}>
            <div className={styles.row}>
                <span className={styles.durationLabel}>Duration</span>
                <span className={styles.durationValue}>{days} {days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>{formatPrice(total, currency as any, rates)}</span>
            </div>
        </div>
    );
}
