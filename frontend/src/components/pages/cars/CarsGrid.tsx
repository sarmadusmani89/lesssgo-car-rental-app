'use client';

import CarCard from '@/components/ui/CarCard';
import { Loader2, Car as CarIcon, Frown } from 'lucide-react';

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
    hp?: number;
}

interface CarsGridProps {
    cars: Car[];
    loading: boolean;
}

export default function CarsGrid({ cars, loading }: CarsGridProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
                <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">Scanning our elite fleet...</p>
            </div>
        );
    }

    if (cars.length === 0) {
        return (
            <div className="bg-white rounded-[3rem] p-16 md:p-24 text-center border border-slate-100 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Frown size={48} className="text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 font-outfit uppercase tracking-tight">No Matching Vehicles</h3>
                <p className="text-slate-500 mt-4 max-w-md mx-auto font-medium">
                    Our curators couldn't find a vehicle matching your exquisite taste. Try adjusting your filters or search query.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all"
                >
                    Reset All Filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {cars.map((car) => (
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
                    monthly={(car.pricePerDay * 25).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    status={car.status}
                    hp={car.hp?.toString() || '---'}
                />
            ))}
        </div>
    );
}
