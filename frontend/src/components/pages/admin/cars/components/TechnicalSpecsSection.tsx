"use client";

import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Users } from "lucide-react";
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    currentTransmission: string;
    transmissionOptions: { label: string; value: string }[];
    currentFuelType: string;
    fuelOptions: { label: string; value: string }[];
}

export default function TechnicalSpecsSection({
    register,
    errors,
    setValue,
    currentTransmission,
    transmissionOptions,
    currentFuelType,
    fuelOptions
}: Props) {
    return (
        <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100 space-y-4">
            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-4">Technical Specs</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Transmission <span className="text-red-500">*</span></label>
                    <CustomSelect
                        options={transmissionOptions}
                        value={currentTransmission}
                        onChange={(val) => setValue("transmission", val)}
                        className="w-full bg-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Fuel Type <span className="text-red-500">*</span></label>
                    <CustomSelect
                        options={fuelOptions}
                        value={currentFuelType}
                        onChange={(val) => setValue("fuelType", val)}
                        className="w-full bg-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Passengers <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="number"
                            {...register("passengers", { valueAsNumber: true })}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                        {errors.passengers && <p className="text-red-500 text-xs mt-1 font-bold">{errors.passengers.message as string}</p>}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Horsepower <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        {...register("hp", { valueAsNumber: true })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {errors.hp && <p className="text-red-500 text-xs mt-1 font-bold">{errors.hp.message as string}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Price / Day (A$) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        {...register("pricePerDay", { valueAsNumber: true })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-blue-600"
                    />
                    {errors.pricePerDay && <p className="text-red-500 text-xs mt-1 font-bold">{errors.pricePerDay.message as string}</p>}
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Fuel Capacity (L) <span className="text-red-500">*</span></label>
                    <input
                        type="number"
                        {...register("fuelCapacity", { valueAsNumber: true })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {errors.fuelCapacity && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fuelCapacity.message as string}</p>}
                </div>
            </div>
        </div>
    );
}
