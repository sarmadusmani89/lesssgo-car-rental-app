'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api, { adminApi } from '@/lib/api';
import { Loader2, ArrowLeft, Edit3, CheckCircle2, XCircle } from 'lucide-react';
import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/CompleteBookingInformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/CarDetailsWithImages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/PaymentStatusAndMethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/BookingStatusTimeline';
import Link from 'next/link';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EditBookingModal from '@/components/pages/admin/bookings/EditBookingModal';
import { UpdateBookingDto } from '@/types/booking';

export default function AdminBookingDetailsPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [statusLoading, setStatusLoading] = useState<string | null>(null);

    // Modal states
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'COMPLETED' | 'CANCELLED' | null;
    }>({ isOpen: false, type: null });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setStatusLoading(newStatus);
        try {
            await api.patch(`/booking/${id}`, { status: newStatus });
            toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
            fetchBooking(); // Refresh data
        } catch (error: any) {
            console.error('Failed to update status:', error);
            const message = error.response?.data?.message || `Failed to update booking status to ${newStatus}`;
            toast.error(message);
        } finally {
            setStatusLoading(null);
            setConfirmModal({ isOpen: false, type: null });
        }
    };

    const handleEditUpdate = async (bookingId: string, data: UpdateBookingDto) => {
        try {
            await adminApi.updateBooking(bookingId, data);
            toast.success('Booking updated successfully');
            fetchBooking();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
            throw error;
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
                <h2 className="text-xl font-bold text-slate-900">Booking not found</h2>
                <Link href="/admin/bookings" className="text-blue-600 hover:underline mt-4 inline-block font-bold">
                    Back to Bookings
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/bookings" className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                            Booking <span className="text-blue-600">Details</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Manage individual reservation records
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <Edit3 size={18} />
                        Edit Booking
                    </button>

                    {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                        <>
                            <button
                                onClick={() => setConfirmModal({ isOpen: true, type: 'COMPLETED' })}
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
                                onClick={() => setConfirmModal({ isOpen: true, type: 'CANCELLED' })}
                                disabled={statusLoading !== null}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-rose-100 text-rose-500 font-bold rounded-xl hover:bg-rose-50 transition-all disabled:opacity-50"
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

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'COMPLETED'}
                onClose={() => setConfirmModal({ isOpen: false, type: null })}
                onConfirm={() => handleUpdateStatus('COMPLETED')}
                title="Mark Trip as Completed?"
                description="Are you sure you want to finish this trip? This should only be done after the vehicle has been returned and inspected."
                variant="success"
                confirmText="Finish Trip"
                isSubmitting={statusLoading === 'COMPLETED'}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'CANCELLED'}
                onClose={() => setConfirmModal({ isOpen: false, type: null })}
                onConfirm={() => handleUpdateStatus('CANCELLED')}
                title="Cancel Booking?"
                description="Are you sure you want to cancel this reservation? The customer will receive a notification and the vehicle will be made available again."
                variant="danger"
                confirmText="Cancel Reservation"
                isSubmitting={statusLoading === 'CANCELLED'}
            />

            {/* Edit Modal */}
            <EditBookingModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleEditUpdate}
                booking={booking}
            />
        </div>
    );
}
