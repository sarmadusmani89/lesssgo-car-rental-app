import { ArrowRight } from 'lucide-react';

interface BookingButtonProps {
    onClick: () => void;
    label: string;
    disabled?: boolean;
}

export default function BookingButton({ onClick, label, disabled }: BookingButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full p-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-primary/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2 group border-none outline-none"
        >
            {label}
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
    );
}

