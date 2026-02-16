'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { UpdateBookingDto } from '@/types/booking';

interface Props {
    formData: UpdateBookingDto;
    onChange: (name: string, value: string) => void;
}

export default function RentalPeriodFields({ formData, onChange }: Props) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        onChange(e.target.name, e.target.value);
    };

    return (
        <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <Calendar size={14} /> Rental Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Pick-up Date"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Return Date"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    required
                />
            </div>
        </div>
    );
}
