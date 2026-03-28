import { formatPrice } from '@/lib/utils';

interface BookingHeaderProps {
    pricePerDay: number;
    currency: string;
    rates: any;
}

export default function BookingHeader({ pricePerDay, currency, rates }: BookingHeaderProps) {
    return (
        <div className="relative z-10 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-2 block">
                Reserve Your Journey
            </span>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 font-outfit tracking-tighter">
                    {formatPrice(pricePerDay, currency as any, rates)}
                </span>
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/ day</span>
            </div>
        </div>
    );
}

