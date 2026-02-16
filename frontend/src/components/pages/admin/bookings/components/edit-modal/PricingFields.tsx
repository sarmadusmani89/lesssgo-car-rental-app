'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { UpdateBookingDto } from '@/types/booking';

interface Props {
    formData: UpdateBookingDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function PricingFields({ formData, onChange }: Props) {
    return (
        <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <DollarSign size={14} /> Pricing
            </h4>
            <div className="grid grid-cols-1 gap-4">
                <FormInput
                    label="Total Amount (PGK)"
                    name="totalAmount"
                    type="number"
                    value={formData.totalAmount || 0}
                    onChange={onChange}
                    required
                />
                <FormInput
                    label="Security Bond (PGK)"
                    name="bondAmount"
                    type="number"
                    value={formData.bondAmount || 0}
                    onChange={onChange}
                    required
                />
            </div>
        </div>
    );
}
