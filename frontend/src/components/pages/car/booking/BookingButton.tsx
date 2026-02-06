import { ArrowRight } from 'lucide-react';
import styles from './BookingButton.module.css';

interface BookingButtonProps {
    onClick: () => void;
    label: string;
    disabled?: boolean;
}

export default function BookingButton({ onClick, label, disabled }: BookingButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={styles.button}
        >
            {label}
            <ArrowRight size={16} className={styles.icon} />
        </button>
    );
}
