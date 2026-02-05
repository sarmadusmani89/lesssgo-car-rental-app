"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CarForm from "@/components/pages/admin/cars/CarForm";
import api from "@/lib/api";
import { Loader2, ChevronLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function EditCarPage() {
    const router = useRouter();
    const { id } = useParams();
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const { data } = await api.get(`/car/${id}`);
                setCar(data);
            } catch (error) {
                toast.error("Failed to fetch car details");
                router.push("/admin/cars");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCar();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium font-outfit">Loading vehicle details...</p>
            </div>
        );
    }

    if (!car) return null;

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
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">Edit Vehicle Record</h1>
                    <p className="text-gray-500 mt-2">Update information for {car.brand} {car.name}.</p>
                </div>

                <div className="p-8">
                    <CarForm
                        onSuccess={() => router.push("/admin/cars")}
                        onCancel={() => router.back()}
                        editingCar={car}
                    />
                </div>
            </div>
        </div>
    );
}
