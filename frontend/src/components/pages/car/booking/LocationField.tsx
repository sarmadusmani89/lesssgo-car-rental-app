import { MapPin } from 'lucide-react';
import styles from './LocationField.module.css';

interface LocationFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options?: string[];
}

export default function LocationField({ label, value, onChange, options }: LocationFieldProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                <MapPin size={12} /> {label}
            </label>
            <div className={styles.selectWrapper}>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.select}
                >
                    {options?.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
