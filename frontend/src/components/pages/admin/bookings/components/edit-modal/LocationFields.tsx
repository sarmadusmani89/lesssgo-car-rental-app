'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { UpdateBookingDto } from '@/types/booking';

interface Props {
    formData: UpdateBookingDto;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function LocationFields({ formData, onChange }: Props) {
    return (
        <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <MapPin size={14} /> Locations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Pick-up Location"
                    name="pickupLocation"
                    value={formData.pickupLocation || ''}
                    onChange={onChange}
                />
                <FormInput
                    label="Return Location"
                    name="returnLocation"
                    value={formData.returnLocation || ''}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
