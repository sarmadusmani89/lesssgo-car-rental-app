"use client";

import { UseFormRegister } from "react-hook-form";
import { MapPin } from "lucide-react";

interface Props {
    register: UseFormRegister<any>;
}

export default function LocationSection({ register }: Props) {
    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1.5 uppercase">
                        <MapPin size={14} className="text-blue-500" /> Pickup Location
                    </label>
                    <input
                        {...register("pickupLocation")}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1.5 uppercase">
                        <MapPin size={14} className="text-red-500" /> Dropoff Location
                    </label>
                    <input
                        {...register("dropoffLocation")}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                    />
                </div>
            </div>
        </div>
    );
}
