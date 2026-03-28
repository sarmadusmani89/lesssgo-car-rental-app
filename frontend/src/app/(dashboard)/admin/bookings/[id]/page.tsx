'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api, { adminApi } from '@/lib/api';
import { Loader2, ArrowLeft, Edit3, CheckCircle2, XCircle } from 'lucide-react';
import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/CompleteBookingInformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/CarDetailsWithImages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/PaymentStatusAndMethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/BookingStatusTimeline';
import { toast } from 'sonner';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EditBookingModal from '@/components/pages/admin/bookings/EditBookingModal';
import { UpdateBookingDto } from '@/types/booking';
import { Button } from '@/components/ui/Button';

export default function AdminBookingDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100/50">
                    <Loader2 className="animate-spin text-primary" size={28} />
                </div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Fetching Reservation</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100/50">
                    <Loader2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Booking not found</h2>
                <p className="text-slate-500 mt-2 font-medium text-sm">The reservation identifier provided is invalid or has been removed.</p>
                <Button
                    onClick={() => router.push('/admin/bookings')}
                    variant="secondary"
                    className="mt-8 px-8 py-2.5 h-auto rounded-xl text-[11px] font-bold uppercase tracking-widest bg-slate-100 text-slate-900 hover:bg-slate-200"
                >
                    Back to Bookings
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/bookings')}
                        className="p-2.5 bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Booking <span className="text-primary">Details</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">
                            Manage reservation <span className="text-slate-900 font-bold">#{booking.id.toString().slice(-8).toUpperCase()}</span> record.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:text-primary transition-all shadow-sm"
                    >
                        <Edit3 size={16} />
                        Edit record
                    </button>

                    {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                        <>
                            <button
                                onClick={() => setConfirmModal({ isOpen: true, type: 'COMPLETED' })}
                                disabled={statusLoading !== null}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                            >
                                {statusLoading === 'COMPLETED' ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                    <CheckCircle2 size={16} />
                                )}
                                Mark Done
                            </button>

                            <button
                                onClick={() => setConfirmModal({ isOpen: true, type: 'CANCELLED' })}
                                disabled={statusLoading !== null}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-rose-100 text-rose-500 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all disabled:opacity-50 shadow-sm"
                            >
                                {statusLoading === 'CANCELLED' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <XCircle size={16} />
                                )}
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <CompleteBookingInformation booking={booking} />
                    <PaymentStatusAndMethod booking={booking} isAdmin={true} />
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <CarDetailsWithImages car={booking.car} />
                    <BookingStatusTimeline booking={booking} />
                </div>
            </div>

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
