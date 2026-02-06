import DatePicker from "react-datepicker";
import { Calendar, Clock } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

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
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Calendar size={12} /> {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <DatePicker
                        selected={dateValue}
                        onChange={onDateChange}
                        selectsStart={selectsStart}
                        selectsEnd={selectsEnd}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        excludeDates={excludeDates}
                        placeholderText="Select Date"
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                    <select
                        value={timeValue}
                        onChange={(e) => onTimeChange(e.target.value)}
                        className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                    >
                        {timeOptions.map((time) => (
                            <option key={time.value} value={time.value}>{time.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
