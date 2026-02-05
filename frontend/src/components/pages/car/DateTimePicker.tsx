"use client";

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
    label: string;
    value: string; // ISO string or YYYY-MM-DDTHH:mm
    onChange: (value: string) => void;
    minDate?: string;
    icon?: React.ReactNode;
}

export default function DateTimePicker({
    label,
    value,
    onChange,
    minDate,
    icon = <Calendar size={18} />
}: DateTimePickerProps) {
    // Separate date and time for local input handling
    const [date, time] = value ? value.split('T') : ['', ''];

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        onChange(`${newDate}T${time || '10:00'}`);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        onChange(`${date || new Date().toISOString().split('T')[0]}T${newTime}`);
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                {icon}
                {label}
            </label>
            <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                    <input
                        type="date"
                        value={date}
                        min={minDate}
                        onChange={handleDateChange}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900"
                    />
                </div>
                <div className="relative">
                    <input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-gray-900"
                    />
                    <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
