"use client";

import CarForm from "@/components/pages/admin/cars/CarForm";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function AddCarPage() {
    const router = useRouter();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition mb-6 font-bold text-xs uppercase tracking-widest"
            >
                <ChevronLeft size={20} />
                Back to Fleet
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">Add New Vehicle</h1>
                    <p className="text-gray-500 mt-2">Enter the details to add a new car to your active fleet.</p>
                </div>

                <div className="p-8">
                    <CarForm
                        onSuccess={() => router.push("/admin/cars")}
                        onCancel={() => router.back()}
                        editingCar={null}
                    />
                </div>
            </div>
        </div>
    );
}
