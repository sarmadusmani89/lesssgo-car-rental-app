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
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500">Duration</span>
                <span className="font-bold text-gray-900">{days} {days === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className="flex justify-between items-center text-lg pt-2 border-t border-blue-100">
                <span className="font-black text-gray-900 font-outfit uppercase">Total</span>
                <span className="font-black text-blue-600 font-outfit">{formatPrice(total, currency, rates)}</span>
            </div>
        </div>
    );
}
