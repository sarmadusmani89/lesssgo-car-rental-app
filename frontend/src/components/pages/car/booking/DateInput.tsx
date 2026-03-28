import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
        <div className="w-full relative">
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
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-accent/20 focus:border-accent"
                wrapperClassName="w-full"
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
}

