import { Calendar } from 'lucide-react';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import styles from './DateTimeField.module.css';

interface DateTimeFieldProps {
    label: string;
    dateValue: Date | null;
    timeValue: string;
    onDateChange: (date: Date | null) => void;
    onTimeChange: (time: string) => void;
    timeOptions: { label: string; value: string }[];
    minDate?: Date;
    maxDate?: Date;
    startDate?: Date | null;
    endDate?: Date | null;
    excludeDates?: Date[];
    selectsStart?: boolean;
    selectsEnd?: boolean;
    required?: boolean;
}

export default function DateTimeField({
    label,
    dateValue,
    timeValue,
    onDateChange,
    onTimeChange,
    timeOptions,
    minDate,
    maxDate,
    startDate,
    endDate,
    excludeDates,
    selectsStart,
    selectsEnd,
    required = true
}: DateTimeFieldProps) {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                <Calendar size={12} /> {label} {required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.grid}>
                <DateInput
                    value={dateValue}
                    onChange={onDateChange}
                    selectsStart={selectsStart}
                    selectsEnd={selectsEnd}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    excludeDates={excludeDates}
                />
                <TimeInput
                    value={timeValue}
                    onChange={onTimeChange}
                    options={timeOptions}
                />
            </div>
        </div>
    );
}
