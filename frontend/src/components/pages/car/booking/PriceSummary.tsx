import { formatPrice } from '@/lib/utils';

interface PriceSummaryProps {
    days: number;
    total: number;
    currency: string;
    rates: any;
}

export default function PriceSummary({ days, total, currency, rates }: PriceSummaryProps) {
    if (total <= 0) return null;

    return (
        <div className="bg-secondary/50 p-4 rounded-xl border border-secondary flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Duration</span>
                <span className="text-sm font-bold text-gray-900">{days} {days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-secondary">
                <span className="text-lg font-black text-gray-900 font-outfit uppercase">Total</span>
                <span className="text-lg font-black text-accent font-outfit uppercase">{formatPrice(total, currency as any, rates)}</span>
            </div>
        </div>
    );
}

