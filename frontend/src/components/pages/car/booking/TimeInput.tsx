import { Clock } from 'lucide-react';
import CustomSelect from '@/components/ui/CustomSelect';

interface TimeInputProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

export default function TimeInput({ value, onChange, options }: TimeInputProps) {
    return (
        <div className="w-full relative">
            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-accent z-10 pointer-events-none" />
            <CustomSelect
                options={options}
                value={value}
                onChange={onChange}
                className="w-full !pl-10 h-full border-none bg-gray-50 rounded-xl"
            />
        </div>
    );
}

