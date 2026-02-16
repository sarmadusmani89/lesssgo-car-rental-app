'use client';

import React from 'react';
import { User } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { UpdateBookingDto } from '@/types/booking';

interface Props {
    formData: UpdateBookingDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function CustomerInfoFields({ formData, onChange }: Props) {
    return (
        <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <User size={14} /> Customer Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                    label="Name"
                    name="customerName"
                    value={formData.customerName || ''}
                    onChange={onChange}
                    required
                />
                <FormInput
                    label="Email"
                    name="customerEmail"
                    type="email"
                    value={formData.customerEmail || ''}
                    onChange={onChange}
                    required
                />
                <FormInput
                    label="Phone"
                    name="customerPhone"
                    value={formData.customerPhone || ''}
                    onChange={onChange}
                    required
                />
            </div>
        </div>
    );
}
