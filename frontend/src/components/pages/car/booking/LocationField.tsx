import { MapPin } from 'lucide-react';

interface LocationFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options?: string[];
}

export default function LocationField({ label, value, onChange, options }: LocationFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 ml-1">
                <MapPin size={12} className="text-accent" /> {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer transition-all focus:ring-2 focus:ring-accent/20 focus:border-accent"
                >
                    {options?.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

