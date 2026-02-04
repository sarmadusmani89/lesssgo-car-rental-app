'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    carId: string;
    carName?: string;
}

export default function AvailabilityCalendar({ carId, carName }: Props) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        if (!carId) return;
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/car/${carId}/bookings`);
                setBookings(res.data);
            } catch (error) {
                console.error("Failed to fetch car bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [carId]);

    // Calendar logic
    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    const calendarDays = [];

    // Padding for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(currentYear, currentMonth, i));
    }

    const isBooked = (date: Date) => {
        if (!date) return false;
        // Normalize date to midnight for comparison
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        return bookings.some(b => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

            return checkDate >= startDate && checkDate <= endDate;
        });
    };

    const nextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const prevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const isToday = (date: Date) => {
        if (!date) return false;
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-400 font-medium font-outfit">Syncing schedule...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
            {/* Header with Navigation */}
            <div className="mb-8 flex justify-between items-start">
                <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-gray-900 font-outfit tracking-tight">
                            {monthNames[currentMonth]} <span className="text-blue-600">{currentYear}</span>
                        </h2>
                        <div className="flex gap-1">
                            <button
                                onClick={prevMonth}
                                className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all active:scale-95"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                        {carName || 'Vehicle Availability'}
                    </p>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-gray-300 mb-4 tracking-widest">{d}</div>
                ))}

                {calendarDays.map((date, i) => {
                    if (!date) {
                        return <div key={`empty-${i}`} className="aspect-square" />;
                    }

                    const booked = isBooked(date);
                    const today = isToday(date);

                    return (
                        <div
                            key={date.toISOString()}
                            title={date.toLocaleDateString()}
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-[13px] font-bold transition-all relative group
                                ${booked
                                    ? "bg-red-50 text-red-500 border border-red-100/30"
                                    : "bg-green-50/50 text-green-600 border border-green-100/30 hover:bg-green-100/50 hover:border-green-200"
                                } 
                                ${today ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''}
                                cursor-default
                            `}
                        >
                            <span className={today ? 'text-blue-600' : ''}>{date.getDate()}</span>
                            {booked ? (
                                <div className="absolute bottom-2 w-1 h-1 bg-red-400 rounded-full" />
                            ) : (
                                <div className="absolute bottom-2 w-1 h-1 bg-green-300 rounded-full opacity-0 group-hover:opacity-100" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-lg shadow-sm shadow-green-200" />
                        Available
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-lg shadow-sm shadow-red-200" />
                        Booked
                    </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                    Current Status
                </div>
            </div>
        </div>
    );
}

