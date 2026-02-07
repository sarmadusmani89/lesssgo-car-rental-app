import { Calendar, AlertCircle, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    booking: any; // Using any to be safe with unknown API response structure initially, but will try to cast
    onCancel: (id: string | number) => void;
    cancellingId: string | number | null;
}

export default function UserBookingCard({ booking, onCancel, cancellingId }: UserBookingCardProps) {
    // Helper to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Helper to determine status color
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
    const isActive = status.toLowerCase() === 'active';

    // Can cancel if not completed and not cancelled
    // Assuming 'Active' bookings might also not be cancellable depending on logic, but user request was specifically "remove cancelled button from completed bookings".
    // Usually you can't cancel an active trip via simple button, but let's follow the user's specific request: "remove the cancelled button from completed bookings".
    // Implies it should be there for others, but common sense says not for Cancelled either.
    const canCancel = !isCompleted && !isCancelled;

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
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <span className="font-bold text-xs">$</span>
                                </div>
                                <span className="text-xl font-black text-slate-900 font-outfit tracking-tighter">
                                    ${booking.totalAmount}
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

                    {canCancel && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancellingId === booking.id ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <AlertCircle size={18} />
                            )}
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
