'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Props {
    carId: string;
    carName?: string;
    startDate: string;
    endDate: string;
    onChange?: (start: string, end: string) => void;
}

export default function UnifiedBookingCalendar({ carId, carName, startDate, endDate, onChange }: Props) {
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
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(currentYear, currentMonth, i));
    }

    const toLocalTime = (date: Date | string) => {
        if (!date) return 0;
        if (typeof date === 'string') {
            const datePart = date.includes('T') ? date.split('T')[0] : date;
            const [year, month, day] = datePart.split('-').map(Number);
            return new Date(year, month - 1, day).getTime();
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    };

    const isBooked = (date: Date) => {
        if (!date) return false;
        const checkTime = toLocalTime(date);
        return bookings.some(b => {
            const startTime = toLocalTime(b.startDate.split('T')[0]);
            const endTime = toLocalTime(b.endDate.split('T')[0]);
            return checkTime >= startTime && checkTime <= endTime;
        });
    };

    const isPast = (date: Date) => {
        if (!date) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTime = today.getTime();

        // No instant booking. Earliest is 48 hours (2 days) from today.
        const earliest = new Date(todayTime);
        earliest.setDate(earliest.getDate() + 2);
        const earliestTime = earliest.getTime();

        return toLocalTime(date) < earliestTime;
    };

    const isInRange = (date: Date) => {
        if (!date || !startDate) return false;
        const checkTime = toLocalTime(date);
        const startTime = toLocalTime(startDate);

        if (endDate) {
            const endTime = toLocalTime(endDate);
            return checkTime >= startTime && checkTime <= endTime;
        }

        return checkTime === startTime;
    };

    const isStart = (date: Date) => {
        if (!date || !startDate) return false;
        return toLocalTime(date) === toLocalTime(startDate);
    };

    const isEnd = (date: Date) => {
        if (!date || !endDate) return false;
        return toLocalTime(date) === toLocalTime(endDate);
    };

    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));
    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));

    const handleDateClick = (date: Date) => {
        // Selection disabled as per user request. 
        // Use the booking form to the right for selection.
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Syncing Availability...</p>
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 w-full border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 font-outfit tracking-tighter uppercase leading-none">
                        {monthNames[currentMonth]} <span className="text-blue-600">{currentYear}</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                        <CalendarIcon size={12} className="text-blue-600" />
                        Availability Reference
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-600">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-gray-400 hover:text-blue-600">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-gray-300 mb-4 tracking-widest">{d}</div>
                ))}

                {calendarDays.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

                    const booked = isBooked(date);
                    const past = isPast(date);
                    const inRange = isInRange(date);
                    const start = isStart(date);
                    const end = isEnd(date);
                    const disabled = booked || past;

                    return (
                        <div
                            key={date.toISOString()}
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-[13px] font-black transition-all relative
                                ${disabled
                                    ? "bg-gray-50 text-gray-200 cursor-not-allowed"
                                    : inRange
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105 z-10"
                                        : "text-gray-600"
                                }
                                ${start ? 'rounded-r-none' : ''}
                                ${end ? 'rounded-l-none' : ''}
                                ${inRange && !start && !end ? 'rounded-none opacity-90' : ''}
                            `}
                        >
                            <span>{date.getDate()}</span>
                            {booked && <div className="absolute bottom-2 w-1 h-1 bg-red-400 rounded-full" />}
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg bg-blue-600 shadow-lg shadow-blue-100" />
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Selected Period</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-lg bg-gray-100" />
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Unavailable</span>
                </div>
            </div>
            <p className="mt-4 text-[9px] font-bold text-blue-600 uppercase tracking-widest text-center italic">
                * Please use the booking form to the right to select your dates
            </p>
        </div>
    );
}
