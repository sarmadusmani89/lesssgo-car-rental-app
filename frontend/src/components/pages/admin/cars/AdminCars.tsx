"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2, X } from "lucide-react";
import { Car } from "./type";
import CarTable from "./cartable";
import CarForm from "./carform";
import api from "@/lib/api";
import { toast } from "sonner";
import AvailabilityCalendar from "@/components/pages/admin/dashboard/AvailabilityCalendar";

export default function AdminCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [showAvailability, setShowAvailability] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);

    // ... fetchCars, delete, toggle ... (rest of the logic remains same)
    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await api.get('/car');
            setCars(res.data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
            toast.error("Failed to load cars");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const filteredCars = cars.filter(
        (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.type.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this car?")) return;
        try {
            await api.delete(`/car/${id}`);
            toast.success("Car deleted successfully");
            fetchCars();
        } catch (error) {
            toast.error("Failed to delete car");
        }
    };

    const handleToggleStatus = async (car: Car) => {
        const newStatus = car.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
        try {
            await api.put(`/car/${car.id}`, { status: newStatus });
            toast.success(`Car marked as ${newStatus.toLowerCase()}`);
            fetchCars();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const openAddForm = () => {
        setEditingCar(null);
        setShowForm(true);
    };

    const openEditForm = (car: Car) => {
        setEditingCar(car);
        setShowForm(true);
    };

    const openAvailability = (car: Car) => {
        setSelectedCar(car);
        setShowAvailability(true);
    };

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">Car Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage your fleet and availability</p>
                </div>

                <button
                    onClick={openAddForm}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 font-medium"
                >
                    <Plus size={20} />
                    Add New Car
                </button>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, brand or type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </div>

            {/* CONTENT */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-gray-500 font-medium font-outfit">Loading your fleet...</p>
                </div>
            ) : (
                <CarTable
                    cars={filteredCars}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onEdit={openEditForm}
                    onViewAvailability={openAvailability}
                />
            )}

            {/* FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowForm(false)}
                    />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <CarForm
                            onSuccess={() => {
                                setShowForm(false);
                                fetchCars();
                            }}
                            onCancel={() => setShowForm(false)}
                            editingCar={editingCar}
                        />
                    </div>
                </div>
            )}

            {/* AVAILABILITY MODAL */}
            {showAvailability && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowAvailability(false)}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={() => setShowAvailability(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <AvailabilityCalendar
                            carId={selectedCar.id}
                            carName={`${selectedCar.brand} ${selectedCar.name}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
