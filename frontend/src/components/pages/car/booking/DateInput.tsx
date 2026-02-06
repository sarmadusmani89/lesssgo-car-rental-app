import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './DateInput.module.css';

interface DateInputProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    startDate?: Date | null;
    endDate?: Date | null;
    excludeDates?: Date[];
    selectsStart?: boolean;
    selectsEnd?: boolean;
    placeholder?: string;
}

export default function DateInput({
    value,
    onChange,
    minDate,
    maxDate,
    startDate,
    endDate,
    excludeDates,
    selectsStart,
    selectsEnd,
    placeholder = "Select Date"
}: DateInputProps) {
    return (
        <div className={styles.container}>
            <DatePicker
                selected={value}
                onChange={onChange}
                selectsStart={selectsStart}
                selectsEnd={selectsEnd}
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                excludeDates={excludeDates}
                placeholderText={placeholder}
                className={styles.input}
                wrapperClassName={styles.datePickerWrapper}
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
}
