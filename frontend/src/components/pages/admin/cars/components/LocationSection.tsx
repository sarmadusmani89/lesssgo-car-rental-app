"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { MapPin } from "lucide-react";
import MultiSelect from "@/components/ui/MultiSelect";
import { PREDEFINED_LOCATIONS } from "@/constants/locations";

interface Props {
    control: Control<any>;
    errors: FieldErrors<any>;
}

export default function LocationSection({ control, errors }: Props) {
    return (
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Location Details</h3>
            <div className="grid grid-cols-1 space-y-4">
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1.5 uppercase">
                        <MapPin size={14} className="text-blue-500" /> Pickup Locations <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="pickupLocation"
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={PREDEFINED_LOCATIONS}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select pickup locations..."
                            />
                        )}
                    />
                    {errors.pickupLocation && (
                        <p className="mt-1 text-xs text-red-500 font-bold">{errors.pickupLocation.message as string}</p>
                    )}
                </div>
                <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1.5 uppercase">
                        <MapPin size={14} className="text-red-500" /> Return Locations <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        name="returnLocation"
                        control={control}
                        render={({ field }) => (
                            <MultiSelect
                                options={PREDEFINED_LOCATIONS}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select return locations..."
                            />
                        )}
                    />
                    {errors.returnLocation && (
                        <p className="mt-1 text-xs text-red-500 font-bold">{errors.returnLocation.message as string}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
