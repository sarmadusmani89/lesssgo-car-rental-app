'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { UpdateBookingDto, BookingStatus, PaymentStatus } from '@/types/booking';

interface Props {
    formData: UpdateBookingDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function StatusFields({ formData, onChange }: Props) {
    return (
        <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <Loader2 size={14} /> Status Management
            </h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Booking Status</label>
                    <select
                        name="status"
                        value={formData.status || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Payment Status</label>
                    <select
                        name="paymentStatus"
                        value={formData.paymentStatus || ''}
                        onChange={onChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
