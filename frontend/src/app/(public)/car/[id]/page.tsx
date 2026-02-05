'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import ImageGalleryWithLightbox from '@/components/pages/car/ImageGalleryWithLightbox';
import CarSpecifications from '@/components/pages/car/CarSpecification';
import PricingDisplay from '@/components/pages/car/PricingDisplay';
import RealTimeAvailabilityCheck from '@/components/pages/car/RealtimeAvailabilityCheck';
import TotalCostCalculation from '@/components/pages/car/TotalCostCalculation';
import BookNowCTAButton from '@/components/pages/car/BookNowCtaButton';
import UnifiedBookingCalendar from '@/components/pages/car/UnifiedBookingCalendar';
import api from '@/lib/api';
import { toast } from "sonner";
import { Loader2, ShieldCheck, Zap, Info } from 'lucide-react';

interface Car {
    id: string;
    name: string;
    brand: string;
    imageUrl: string;
    pricePerDay: number;
    type: string;
    transmission: string;
    fuelCapacity: number;
    hp: number;
    description: string;
}

function CarContent() {
    const params = useParams();

    const carId = params.id as string;

    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState({
        startDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString().slice(0, 16),
        endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16),
    });

    useEffect(() => {
        if (!carId) return;

        const fetchCar = async () => {
            try {
                const res = await api.get(`/car/${carId}`);
                setCar(res.data);
            } catch (error) {
                console.error("Failed to fetch car:", error);
                toast.error("Failed to load car details");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [carId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (!car) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center">
                <h1 className="text-4xl font-black text-gray-900 font-outfit uppercase tracking-tight mb-4">
                    Vehicle <span className="text-blue-600">Not Found</span>
                </h1>
                <p className="text-gray-500 font-medium mb-8">
                    The requested vehicle ID <b>{carId || 'None'}</b> could not be located in our exquisite fleet.
                </p>
                <button
                    onClick={() => window.location.href = '/cars'}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all"
                >
                    View Available Fleet
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <nav className="flex mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => window.location.href = '/cars'}>Vehicles</span>
                        <span className="mx-3 text-gray-200">/</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">{car.brand}</span>
                        <span className="mx-3 text-gray-200">/</span>
                        <span className="text-blue-600">{car.name}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                                <Zap size={12} className="fill-blue-600" />
                                Advance Booking Required
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-3 leading-none">
                                    {car.brand}
                                </span>
                                <h1 className="text-4xl md:text-7xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">
                                    <span className="text-blue-600">{car.name}</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] pt-4">
                                Exquisite <span className="text-blue-600/50">{car.type}</span> Experience
                            </p>
                        </div>
                        <div className="flex flex-col items-start md:items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Elite Fleet rate</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-blue-600 font-outfit tracking-tighter">${car.pricePerDay}</span>
                                <span className="text-gray-400 font-black text-sm uppercase tracking-widest">/ day</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content with increased top margin */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Left Column: Focus on Content (8 cols) */}
                    <div className="lg:col-span-8 space-y-16">
                        <section className="bg-white p-2 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-white overflow-hidden">
                            <ImageGalleryWithLightbox images={car.imageUrl ? [car.imageUrl] : []} />
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-black text-gray-900 font-outfit tracking-tight uppercase">Technical Specs</h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
                            </div>
                            <CarSpecifications specs={{
                                seats: 5,
                                type: car.type,
                                fuel: `${car.fuelCapacity}L`,
                                transmission: car.transmission,
                                hp: car.hp
                            }} />
                        </section>

                        <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 md:mb-8">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                                        <Info size={20} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black font-outfit tracking-tight uppercase">Vehicle Description</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg font-medium">
                                    {car.description || `Experience pure performance and luxury with the ${car.brand} ${car.name}. This ${car.type} vehicle combines state-of-the-art engineering with unparalleled comfort for an unforgettable driving journey.`}
                                </p>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-black text-gray-900 font-outfit tracking-tight uppercase">Live Availability & Selection</h3>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
                            </div>
                            <UnifiedBookingCalendar
                                carId={car.id}
                                carName={car.name}
                                startDate={dates.startDate}
                                endDate={dates.endDate}
                                onChange={(start, end) => setDates({ startDate: start, endDate: end })}
                            />
                        </section>
                    </div>

                    {/* Right Column: Dynamic Summary (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-10">
                        <article className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-blue-100/30 border border-blue-50/50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-blue-600" />

                            <h3 className="text-lg md:text-xl font-black text-gray-900 font-outfit mb-8 md:mb-10 tracking-tight uppercase flex items-center justify-between">
                                Reservation Summary
                                <ShieldCheck size={20} className="text-green-500" />
                            </h3>

                            <div className="space-y-8 md:space-y-10">
                                <RealTimeAvailabilityCheck
                                    carId={car.id}
                                    startDate={dates.startDate}
                                    endDate={dates.endDate}
                                />

                                <TotalCostCalculation
                                    pricePerDay={car.pricePerDay}
                                    startDate={dates.startDate}
                                    endDate={dates.endDate}
                                />

                                <BookNowCTAButton
                                    carId={car.id}
                                    startDate={dates.startDate}
                                    endDate={dates.endDate}
                                    disabled={!dates.startDate || !dates.endDate}
                                />
                            </div>

                            <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-gray-100 flex flex-col gap-6">
                                <div className="flex items-center gap-4 text-gray-400">
                                    <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight">Elite Protection & Insurance Coverage</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                        <Zap size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight">24/7 Roadside Assistance Protocol</span>
                                </div>
                            </div>
                        </article>

                        <div className="p-10 bg-gray-900 rounded-[3rem] text-white shadow-2xl shadow-gray-200 overflow-hidden relative group">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full -mr-24 -mb-24 transition-transform duration-700 group-hover:scale-150" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-3">Concierge Service</p>
                                <h4 className="text-2xl font-black font-outfit mb-4 uppercase tracking-tight">Need Support?</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                                    Our dedicated specialist team is available 24/7 to personalize your legendary driving experience.
                                </p>
                                <button className="w-full py-5 bg-white text-gray-900 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CarPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <CarContent />
        </Suspense>
    );
}
