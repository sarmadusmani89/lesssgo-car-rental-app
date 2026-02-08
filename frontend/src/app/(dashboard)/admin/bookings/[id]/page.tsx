'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, ArrowLeft } from 'lucide-react';
import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/CompleteBookingInformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/CarDetailsWithImages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/PaymentStatusAndMethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/BookingStatusTimeline';
import Link from 'next/link';

export default function AdminBookingDetailsPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/booking/${id}`);
                setBooking(res.data);
            } catch (error) {
                console.error('Failed to fetch booking:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold">Booking not found</h2>
                <Link href="/admin/bookings" className="text-blue-600 hover:underline mt-4 inline-block">
                    Back to Bookings
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/bookings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold font-outfit">Booking Details (Admin)</h1>
            </div>

            <CompleteBookingInformation booking={booking} />
            <CarDetailsWithImages car={booking.car} />
            <PaymentStatusAndMethod booking={booking} isAdmin={true} />
            <BookingStatusTimeline booking={booking} />
        </div>
    );
}
