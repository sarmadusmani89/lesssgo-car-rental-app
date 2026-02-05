"use client";

import { UseFormSetValue } from "react-hook-form";
import { Check, Snowflake, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
    setValue: UseFormSetValue<any>;
    freeCancellation: boolean;
    airConditioner: boolean;
    gps: boolean;
    currentStatus: string;
    statusOptions: { label: string; value: string }[];
}

export default function FeaturesStatusSection({
    setValue,
    freeCancellation,
    airConditioner,
    gps,
    currentStatus,
    statusOptions
}: Props) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Features & Fleet Status</h3>

            <div className="flex flex-wrap gap-4">
                <button
                    type="button"
                    onClick={() => setValue("freeCancellation", !freeCancellation)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-bold text-xs uppercase ${freeCancellation ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                    <Check size={14} /> Free Cancel (48h)
                </button>
                <button
                    type="button"
                    onClick={() => setValue("airConditioner", !airConditioner)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-bold text-xs uppercase ${airConditioner ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                    <Snowflake size={14} /> Air Conditioning
                </button>
                <button
                    type="button"
                    onClick={() => setValue("gps", !gps)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition font-bold text-xs uppercase ${gps ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-400'}`}
                >
                    <MapPin size={14} /> GPS Navigation
                </button>
            </div>

            <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Current Availability</label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className={`w-full px-4 py-2.5 rounded-xl border flex items-center justify-between transition ${isStatusOpen ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200 bg-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${currentStatus === 'AVAILABLE' ? 'bg-green-500' : currentStatus === 'RENTED' ? 'bg-blue-500' : 'bg-red-500'}`} />
                            <span className="font-bold text-sm text-gray-700 uppercase">
                                {statusOptions.find(o => o.value === currentStatus)?.label}
                            </span>
                        </div>
                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isStatusOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setValue("status", option.value as any);
                                        setIsStatusOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-between transition ${currentStatus === option.value ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    <span className="font-bold text-xs uppercase py-1">{option.label}</span>
                                    {currentStatus === option.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
