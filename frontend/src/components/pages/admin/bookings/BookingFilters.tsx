import React from 'react';
import CustomSelect from '@/components/ui/CustomSelect';
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
                <CustomSelect
                    options={[
                        { label: 'All Status', value: 'ALL' },
                        ...(Object.values(BookingStatus) as BookingStatus[]).map(status => ({
                            label: status,
                            value: status
                        }))
                    ]}
                    value={statusFilter}
                    onChange={(val) => onStatusFilterChange(val as BookingStatus | 'ALL')}
                    className="w-[160px]"
                />

                <CustomSelect
                    options={[
                        { label: 'All Payments', value: 'ALL' },
                        ...(Object.values(PaymentStatus) as PaymentStatus[]).map(status => ({
                            label: status,
                            value: status
                        }))
                    ]}
                    value={paymentFilter}
                    onChange={(val) => onPaymentFilterChange(val as PaymentStatus | 'ALL')}
                    className="w-[160px]"
                />
            </div>
        </div>
    );
};
