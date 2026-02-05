'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    car: {
        id: string;
        pricePerDay: number;
        pickupLocation?: string[];
        dropoffLocation?: string[];
    };
    defaultStartDate?: string;
    defaultEndDate?: string;
    onDatesChange?: (start: string, end: string) => void;
}

const TIME_OPTIONS = Array.from({ length: 13 * 2 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 30; // Start at 9:00
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 21) return null; // End at 21:00
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { label: time, value: time };
}).filter(Boolean) as { label: string; value: string }[];

export default function BookingForm({ car, defaultStartDate, defaultEndDate, onDatesChange }: Props) {
    const router = useRouter();

    const [pickupLocation, setPickupLocation] = useState('');
    const [returnLocation, setReturnLocation] = useState('');

    // Initialize with props or empty
    const [pickupDate, setPickupDate] = useState(defaultStartDate ? defaultStartDate.split('T')[0] : '');
    const [pickupTime, setPickupTime] = useState('10:00');
    const [returnDate, setReturnDate] = useState(defaultEndDate ? defaultEndDate.split('T')[0] : '');
    const [returnTime, setReturnTime] = useState('10:00');

    // Sync when props change (e.g. from big calendar click)
    useEffect(() => {
        if (defaultStartDate) setPickupDate(defaultStartDate.split('T')[0]);
        if (defaultEndDate) setReturnDate(defaultEndDate.split('T')[0]);
    }, [defaultStartDate, defaultEndDate]);

    // Handle date changes and sync back
    const handleDateChange = (type: 'pickup' | 'return', date: string) => {
        let newPickup = pickupDate;
        let newReturn = returnDate;

        if (type === 'pickup') {
            newPickup = date;
            setPickupDate(date);
            // Validation: Dropoff always > Pickup
            if (newReturn && new Date(date) > new Date(newReturn)) {
                newReturn = date;
                setReturnDate(date);
            }
        } else {
            // Dropoff Date Validation
            if (newPickup && new Date(date) < new Date(newPickup)) {
                toast.error("Return date cannot be before pick-up date");
                return;
            }
            newReturn = date;
            setReturnDate(date);
        }

        if (onDatesChange && newPickup) {
            // Construct ISO strings roughly for the calendar sync
            const startISO = `${newPickup}T${pickupTime}`;
            const endISO = newReturn ? `${newReturn}T${returnTime}` : '';
            onDatesChange(startISO, endISO);
        }
    };

    // Set default locations if available
    useEffect(() => {
        if (car.pickupLocation && car.pickupLocation.length > 0) {
            setPickupLocation(car.pickupLocation[0]);
        }
        if (car.dropoffLocation && car.dropoffLocation.length > 0) {
            setReturnLocation(car.dropoffLocation[0]);
        }
    }, [car]);

    const calculateTotal = () => {
        if (!pickupDate || !returnDate) return 0;

        const start = new Date(`${pickupDate}T${pickupTime}`);
        const end = new Date(`${returnDate}T${returnTime}`);

        // Calculate difference in milliseconds
        const diff = end.getTime() - start.getTime();

        if (isNaN(diff) || diff <= 0) return 0;

        // Calculate 24-hour periods, rounding up
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return Math.max(1, days) * car.pricePerDay;
    };

    const total = calculateTotal();
    const days = total / car.pricePerDay;

    const handleBooking = () => {
        if (!pickupDate || !returnDate || !pickupLocation || !returnLocation) {
            toast.error("Please complete all booking details");
            return;
        }

        const startCombined = `${pickupDate}T${pickupTime}`;
        const endCombined = `${returnDate}T${returnTime}`;

        // Check if user is logged in
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const checkoutUrl = `/checkout?id=${car.id}&startDate=${startCombined}&endDate=${endCombined}&pickupLocation=${encodeURIComponent(pickupLocation)}&dropoffLocation=${encodeURIComponent(returnLocation)}`;

        if (!token) {
            toast.info('Authenticating...', {
                description: 'Please sign in to proceed with your reservation.',
                duration: 4000
            });
            router.push(`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`);
            return;
        }

        router.push(checkoutUrl);
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-blue-100/30 border border-gray-100 relative overflow-hidden">
            {/* Header */}
            <div className="relative z-10 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 block">
                    Reserve Your Journey
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 font-outfit tracking-tighter">
                        ${car.pricePerDay}
                    </span>
                    <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/ day</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* Locations */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                            <MapPin size={12} /> Pick Up Location
                        </label>
                        <div className="relative">
                            <select
                                value={pickupLocation}
                                onChange={(e) => setPickupLocation(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                {car.pickupLocation?.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                            <MapPin size={12} /> Return Location
                        </label>
                        <div className="relative">
                            <select
                                value={returnLocation}
                                onChange={(e) => setReturnLocation(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                {car.dropoffLocation?.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pick-Up Date & Time */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <Calendar size={12} /> Pick-Up Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => handleDateChange('pickup', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <div className="relative">
                            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                            <select
                                value={pickupTime}
                                onChange={(e) => setPickupTime(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                {TIME_OPTIONS.map((time) => (
                                    <option key={time.value} value={time.value}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Return Date & Time */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <Calendar size={12} /> Return Date & Time <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => handleDateChange('return', e.target.value)}
                            min={pickupDate || new Date().toISOString().split('T')[0]}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <div className="relative">
                            <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                            <select
                                value={returnTime}
                                onChange={(e) => setReturnTime(e.target.value)}
                                className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                {TIME_OPTIONS.map((time) => (
                                    <option key={time.value} value={time.value}>
                                        {time.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                {total > 0 && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-500">Duration</span>
                            <span className="font-bold text-gray-900">{days} Days</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2 border-t border-blue-100">
                            <span className="font-black text-gray-900 font-outfit uppercase">Total</span>
                            <span className="font-black text-blue-600 font-outfit">${total}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleBooking}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                    Book Now
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed px-4">
                    You won't be charged yet. We'll check availability and confirm your booking instantly.
                </p>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50 pointer-events-none" />
        </div>
    );
}
