import { Calendar } from 'lucide-react';
import DateInput from './DateInput';
import TimeInput from './TimeInput';

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
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 ml-1">
                <Calendar size={12} className="text-accent" /> {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

