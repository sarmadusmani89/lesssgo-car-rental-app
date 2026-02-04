'use client';

import { useState, useEffect } from 'react';
import CarCard from '@/components/ui/CarCard';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { Loader2, Calendar } from 'lucide-react';

interface Car {
    id: string;
    brand: string;
    name: string;
    imageUrl: string;
    pricePerDay: number;
    type: string;
    transmission: string;
    fuelCapacity: number;
    status: string;
}

export default function CarsLayout() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const brand = searchParams.get('brand');
    const type = searchParams.get('type');

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams(searchParams.toString());
                const res = await api.get(`/car?${params.toString()}`);
                setCars(res.data);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [searchParams]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Search Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 font-outfit">
                    Find Your <span className="text-blue-600">Perfect Ride</span>
                </h1>
                <p className="text-gray-500 mt-2">Explore our premium fleet available for your selected dates.</p>

                {startDate && endDate && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
                        <Calendar size={16} />
                        Available for: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                    <p className="text-gray-500 font-medium">Scanning our fleet...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.length > 0 ? (
                        cars.map((car) => (
                            <CarCard
                                key={car.id}
                                id={car.id}
                                brand={car.brand}
                                name={car.name}
                                image={car.imageUrl || '/images/car-placeholder.jpg'}
                                price={car.pricePerDay.toString()}
                                type={car.type}
                                fuel={car.fuelCapacity.toString() + 'L'}
                                transmission={car.transmission}
                                // These fields might need mapping if CarCard expects specific props
                                monthly={(car.pricePerDay * 25).toString()}
                                location="Main Showroom"
                                badge={car.status}
                                badgeClass={car.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}
                                hp="-"
                            />
                        ))
                    ) : (
                        <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 font-outfit">No Available Cars</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                We couldn't find any vehicles matching your criteria or dates. Try adjusting your search or choosing different dates.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
