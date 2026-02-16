import { Calendar, AlertCircle, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDashboardDate } from '@/lib/utils';

interface Booking {
    id: number | string;
    car: {
        name: string;
        brand: string;
        image?: string;
    } | string;
    startDate: string;
    endDate: string;
    status: string;
    totalAmount?: number;
}

interface UserBookingCardProps {
    booking: any;
    onCancel: (id: string | number) => void;
    cancellingId: string | number | null;
}

export default function UserBookingCard({ booking, onCancel, cancellingId }: UserBookingCardProps) {
    const formatDate = (dateString: string) => formatDashboardDate(dateString);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'completed':
            case 'active':
            case 'approved':
                return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'pending':
            case 'upcoming':
                return 'bg-blue-50 text-blue-600 border border-blue-100';
            case 'cancelled':
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border border-rose-100';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-100';
        }
    };

    const status = booking.status || 'Pending';
    const isCompleted = status.toLowerCase() === 'completed';
    const isCancelled = status.toLowerCase() === 'cancelled';
    const isConfirmed = status.toLowerCase() === 'confirmed';

    // Cancellation Rules:
    // 1. Must be Pending or Confirmed
    // 2. Car must allow free cancellation
    // 3. Must be at least 48 hours before pickup
    const carAllowsCancel = booking.car?.freeCancellation ?? true;

    // Time calculation (Wall-Clock safe)
    // We get the numbers on the user's clock (regardless of timezone) 
    // and treat them as UTC to match the DB storage format.
    const localNow = new Date();
    const wallClockNow = new Date(Date.UTC(
        localNow.getFullYear(),
        localNow.getMonth(),
        localNow.getDate(),
        localNow.getHours(),
        localNow.getMinutes(),
        localNow.getSeconds()
    ));

    const pickupDate = new Date(booking.startDate);
    const hoursDifference = (pickupDate.getTime() - wallClockNow.getTime()) / (1000 * 60 * 60);
    const isBefore48h = hoursDifference >= 48;

    const canCancel = (status.toLowerCase() === 'pending' || status.toLowerCase() === 'confirmed') && carAllowsCancel && isBefore48h;

    // Determine restriction message
    let restrictionMessage = '';
    if (!canCancel && !isCompleted && !isCancelled) {
        if (!carAllowsCancel) restrictionMessage = 'Non-refundable booking';
        else if (!isBefore48h) restrictionMessage = 'Inside 48h window';
        else restrictionMessage = 'Cancellation restricted';
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                #{booking.id.toString().slice(-8).toUpperCase()}
                            </span>
                            <div className="flex flex-col mt-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                                    {booking.car?.brand || 'Vehicle'}
                                </span>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight font-outfit uppercase leading-tight">
                                    {booking.car?.name || 'Details'}
                                </h3>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-600 italic">
                                {booking.startDate ? formatDate(booking.startDate) : 'TBD'} — {booking.endDate ? formatDate(booking.endDate) : 'TBD'}
                            </span>
                        </div>

                        {booking.totalAmount && (
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-slate-900 font-outfit tracking-tighter">
                                    K{booking.totalAmount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                    >
                        <Eye size={18} />
                        Details
                    </Link>

                    {!isCompleted && !isCancelled && (
                        <div className="flex-1 md:flex-none flex flex-col items-center gap-1">
                            <button
                                onClick={() => onCancel(booking.id)}
                                disabled={cancellingId === booking.id || !canCancel}
                                className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all shadow-sm ${canCancel
                                    ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100'
                                    : 'bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed'
                                    }`}
                                title={restrictionMessage}
                            >
                                {cancellingId === booking.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <AlertCircle size={18} />
                                )}
                                Cancel
                            </button>
                            {restrictionMessage && (
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {restrictionMessage}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
