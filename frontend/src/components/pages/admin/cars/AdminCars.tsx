'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    Loader2,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AvailabilityCalendar from "@/components/pages/admin/dashboard/AvailabilityCalendar";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Image from 'next/image';
import { Car } from './type';

import AdminCarsHeader from './components/AdminCarsHeader';
import AdminCarSearch from './components/AdminCarSearch';
import AdminCarTable from './components/AdminCarTable';

export default function AdminCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAvailability, setShowAvailability] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [carToDelete, setCarToDelete] = useState<{ id: string; name: string; brand: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await api.get('/car');
            setCars(res.data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
            toast.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async () => {
        if (!carToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/car/${carToDelete.id}`);
            toast.success('Car deleted successfully');
            fetchCars();
            setCarToDelete(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete car');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
        try {
            await api.put(`/car/${id}`, { status: newStatus });
            toast.success(`Car status updated to ${newStatus}`);
            fetchCars();
        } catch (error) {
            toast.error('Failed to update car status');
        }
    };

    const filteredCars = cars.filter(car =>
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.brand.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium font-outfit">Loading fleet inventory...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AdminCarsHeader onAddClick={() => router.push('/admin/cars/add')} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminCarSearch search={search} onSearchChange={setSearch} />

                <AdminCarTable
                    cars={filteredCars}
                    onToggleStatus={toggleStatus}
                    onCheckAvailability={(car) => {
                        setSelectedCar(car);
                        setShowAvailability(true);
                    }}
                    onEdit={(id) => router.push(`/admin/cars/edit/${id}`)}
                    onDelete={setCarToDelete}
                />
            </div>

            {showAvailability && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAvailability(false)} />
                    <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold font-outfit">Availability: {selectedCar.brand} {selectedCar.name}</h2>
                            <button onClick={() => setShowAvailability(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <ChevronDown size={24} className="rotate-90 pointer-events-none" />
                            </button>
                        </div>
                        <AvailabilityCalendar carId={selectedCar.id} />
                    </div>
                </div>
            )}

            {carToDelete && (
                <DeleteConfirmationModal
                    isOpen={true}
                    onClose={() => setCarToDelete(null)}
                    onConfirm={handleDelete}
                    carName={`${carToDelete.brand} ${carToDelete.name}`}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
