'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { UpdateBookingDto, BookingStatus, PaymentStatus } from '@/types/booking';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
    formData: UpdateBookingDto;
    onChange: (name: string, value: string) => void;
}

export default function StatusFields({ formData, onChange }: Props) {
    const statusOptions = Object.values(BookingStatus).map(s => ({ label: s, value: s }));
    const paymentOptions = Object.values(PaymentStatus).map(s => ({ label: s, value: s }));

    return (
        <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <Loader2 size={14} /> Status Management
            </h4>
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight italic">Booking Status</label>
                    <CustomSelect
                        options={statusOptions}
                        value={formData.status || ''}
                        onChange={(val) => onChange('status', val)}
                        className="w-full"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight italic">Payment Status</label>
                    <CustomSelect
                        options={paymentOptions}
                        value={formData.paymentStatus || ''}
                        onChange={(val) => onChange('paymentStatus', val)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
}
