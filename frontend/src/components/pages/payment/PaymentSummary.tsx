'use client';

import React from 'react';
import { Car, Receipt, Clock, CreditCard } from 'lucide-react';
import { formatPrice, formatDashboardDate } from '@/lib/utils';

interface PaymentSummaryProps {
    carName: string;
    total: number;
    bond: number;
    startDate: string;
    endDate: string;
    paymentMethod: string;
    paymentStatus: string;
    currency: string;
    rates: any;
}

export default function PaymentSummary({
    carName,
    total,
    bond,
    startDate,
    endDate,
    paymentMethod,
    paymentStatus,
    currency,
    rates
}: PaymentSummaryProps) {
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        return formatDashboardDate(dateStr);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                        <Car size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Selected Vehicle</span>
                        <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">{carName || 'Vehicle'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                            Grand Total {paymentStatus === 'PAID' || paymentStatus === 'CONFIRMED' ? '(Paid)' : '(To Be Paid)'}
                        </span>
                        <div className="space-y-1">
                            <p className="text-2xl font-black text-blue-600 font-outfit uppercase tracking-tight">
                                {formatPrice(total + bond, currency as any, rates)}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                (Rental: {formatPrice(total, currency as any, rates)} + Bond: {formatPrice(bond, currency as any, rates)})
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Rental Period</span>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400">PICKUP</span>
                                <span className="text-[10px] font-black text-gray-900">{formatDate(startDate)}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400">RETURN</span>
                                <span className="text-[10px] font-black text-gray-900">{formatDate(endDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Settlement Method</span>
                        <span className="text-gray-900 font-bold">{paymentMethod === 'CASH' ? 'Cash on Collection' : 'Debit/Credit Card'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
