import { MapPin } from 'lucide-react';

interface LocationFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options?: string[];
}

export default function LocationField({ label, value, onChange, options }: LocationFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <MapPin size={12} /> {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                >
                    {options?.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
