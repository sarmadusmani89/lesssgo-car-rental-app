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
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function AdminBookingDetailsPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [statusLoading, setStatusLoading] = useState<string | null>(null);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/booking/${id}`);
            setBooking(res.data);
        } catch (error) {
            console.error('Failed to fetch booking:', error);
            toast.error('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBooking();
    }, [id]);

    const handleUpdateStatus = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this booking as ${newStatus.toLowerCase()}?`)) return;

        setStatusLoading(newStatus);
        try {
            await api.patch(`/booking/${id}`, { status: newStatus });
            toast.success(`Booking marked as ${newStatus.toLowerCase()} successfully`);
            fetchBooking(); // Refresh data
        } catch (error: any) {
            console.error('Failed to update status:', error);
            toast.error(error.response?.data?.message || `Failed to update booking status to ${newStatus}`);
        } finally {
            setStatusLoading(null);
        }
    };

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/bookings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold font-outfit uppercase italic tracking-tight">
                        Booking <span className="text-blue-600">Details</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                        <>
                            <button
                                onClick={() => handleUpdateStatus('COMPLETED')}
                                disabled={statusLoading !== null}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                            >
                                {statusLoading === 'COMPLETED' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 size={18} />
                                )}
                                Mark Completed
                            </button>

                            <button
                                onClick={() => handleUpdateStatus('CANCELLED')}
                                disabled={statusLoading !== null}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 font-bold rounded-xl hover:bg-rose-100 transition-all disabled:opacity-50"
                            >
                                {statusLoading === 'CANCELLED' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <XCircle size={18} />
                                )}
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <CompleteBookingInformation booking={booking} />
            <CarDetailsWithImages car={booking.car} />
            <PaymentStatusAndMethod booking={booking} isAdmin={true} />
            <BookingStatusTimeline booking={booking} />
        </div>
    );
}
