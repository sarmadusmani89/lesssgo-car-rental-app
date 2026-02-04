'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface Props {
    carId: string;
    carName?: string;
}

export default function AvailabilityCalendar({ carId, carName }: Props) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const isBooked = (date: Date) => {
        return bookings.some(b => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            return date >= start && date <= end;
        });
    };

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 p-8 w-full max-w-lg">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 font-outfit">Vehicle Schedule</h2>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">{carName || 'Fleet Availability'}</p>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-gray-300 mb-2">{d}</div>
                ))}
                {days.map((date, i) => {
                    const booked = isBooked(date);
                    const isToday = i === 0;
                    return (
                        <div
                            key={i}
                            title={date.toLocaleDateString()}
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-xs font-bold transition-all relative ${booked
                                ? "bg-red-50 text-red-500 border border-red-100/50"
                                : "bg-green-50 text-green-600 border border-green-100/50"
                                } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                        >
                            {date.getDate()}
                            {booked && <div className="w-1 h-1 bg-red-400 rounded-full mt-1" />}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm shadow-green-200" /> Available
                </div>
                <div className="flex items-center gap-2 text-red-600">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm shadow-red-200" /> Booked
                </div>
            </div>
        </div>
    );
}
