'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import FormInput from '@/components/ui/FormInput';
import { UpdateBookingDto } from '@/types/booking';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
    formData: UpdateBookingDto;
    pickupOptions: { label: string; value: string }[];
    returnOptions: { label: string; value: string }[];
    onChange: (name: string, value: string) => void;
}

export default function LocationFields({ formData, pickupOptions, returnOptions, onChange }: Props) {
    return (
        <div className="space-y-4 md:col-span-2">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                <MapPin size={14} /> Locations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight italic">Pick-up Location</label>
                    <CustomSelect
                        options={pickupOptions}
                        value={formData.pickupLocation || ''}
                        onChange={(val) => onChange('pickupLocation', val)}
                        className="w-full"
                        placeholder="Select Pick-up..."
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight italic">Return Location</label>
                    <CustomSelect
                        options={returnOptions}
                        value={formData.returnLocation || ''}
                        onChange={(val) => onChange('returnLocation', val)}
                        className="w-full"
                        placeholder="Select Return..."
                    />
                </div>
            </div>
        </div>
    );
}
