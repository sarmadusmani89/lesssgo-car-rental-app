"use client";

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    setValue: UseFormSetValue<any>;
    currentBrand: string;
    currentCategory: string;
    currentClass: string;
    brandOptions: { label: string; value: string }[];
    categoryOptions: { label: string; value: string }[];
    classOptions: { label: string; value: string }[];
}

export default function BasicInfoSection({
    register,
    errors,
    setValue,
    currentBrand,
    currentCategory,
    currentClass,
    brandOptions,
    categoryOptions,
    classOptions
}: Props) {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Basic Information</h3>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Vehicle Name <span className="text-red-500">*</span></label>
                    <input
                        {...register("name")}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                        placeholder="e.g. Land Cruiser VX-R"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Brand <span className="text-red-500">*</span></label>
                        <CustomSelect
                            options={brandOptions}
                            value={currentBrand}
                            onChange={(val) => setValue("brand", val)}
                            className="w-full bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Category <span className="text-red-500">*</span></label>
                        <CustomSelect
                            options={categoryOptions}
                            value={currentCategory}
                            onChange={(val) => setValue("type", val)}
                            className="w-full bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase">Vehicle Class <span className="text-red-500">*</span></label>
                    <CustomSelect
                        options={classOptions}
                        value={currentClass}
                        onChange={(val) => setValue("vehicleClass", val)}
                        className="w-full bg-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-widest">Description</label>
                <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Key features, condition, or special instructions..."
                />
            </div>
        </div>
    );
}
