import { Clock } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';
import styles from './TimeInput.module.css';

interface TimeInputProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

export default function TimeInput({ value, onChange, options }: TimeInputProps) {
    return (
        <div className={styles.container}>
            <Clock size={16} className={styles.icon} />
            <CustomSelect
                options={options}
                value={value}
                onChange={onChange}
                className="w-full !pl-10 h-full border-none"
            />
        </div>
    );
}
