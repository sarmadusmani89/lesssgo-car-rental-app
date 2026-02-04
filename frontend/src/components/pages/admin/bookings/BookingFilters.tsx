import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SearchBar } from '../../../ui/SearchBar';
import { BookingStatus, PaymentStatus } from '../../../../types/booking';

interface BookingFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: BookingStatus | 'ALL';
    onStatusFilterChange: (status: BookingStatus | 'ALL') => void;
    paymentFilter: PaymentStatus | 'ALL';
    onPaymentFilterChange: (status: PaymentStatus | 'ALL') => void;
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    paymentFilter,
    onPaymentFilterChange,
}) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:space-y-0 md:flex gap-4 items-center">
            <SearchBar
                value={search}
                onChange={onSearchChange}
                placeholder="Search ID, name, email or car..."
            />

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative group">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as any)}
                        className="appearance-none bg-slate-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[140px]"
                    >
                        <option value="ALL">All Status</option>
                        {(Object.values(BookingStatus) as BookingStatus[]).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative group">
                    <select
                        value={paymentFilter}
                        onChange={(e) => onPaymentFilterChange(e.target.value as any)}
                        className="appearance-none bg-slate-50 border-none rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer min-w-[140px]"
                    >
                        <option value="ALL">All Payments</option>
                        {(Object.values(PaymentStatus) as PaymentStatus[]).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
};
