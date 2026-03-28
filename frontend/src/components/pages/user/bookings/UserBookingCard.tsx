import { Calendar, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
                return 'bg-emerald-50 text-emerald-600 border border-emerald-100/50';
            case 'pending':
            case 'upcoming':
                return 'bg-primary/5 text-primary border border-primary/10';
            case 'cancelled':
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border border-rose-100/50';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-100/50';
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
        <div className="bg-white rounded-3xl border border-slate-100 p-6 transition-all hover:shadow-lg hover:shadow-slate-100 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Booking #{booking.id.toString().slice(-8).toUpperCase()}
                            </span>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                                {booking.car?.brand} {booking.car?.name}
                            </h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>
 
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-600">
                                {booking.startDate ? formatDate(booking.startDate) : 'TBD'} — {booking.endDate ? formatDate(booking.endDate) : 'TBD'}
                            </span>
                        </div>
 
                        {booking.totalAmount && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                                <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                                    <span className="text-primary text-xs mr-0.5">K</span>{booking.totalAmount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
 
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        href={`/dashboard/bookings/${booking.id}`}
                        variant="secondary"
                        className="flex-1 md:flex-none bg-slate-100 text-slate-900 hover:bg-slate-200 border-none px-6 py-2 h-auto text-[11px] font-bold uppercase tracking-widest rounded-xl"
                    >
                        View Details
                    </Button>
 
                    {!isCompleted && !isCancelled && (
                        <div className="flex-1 md:flex-none flex flex-col items-center gap-1">
                            <Button
                                onClick={() => onCancel(booking.id)}
                                isLoading={cancellingId === booking.id}
                                disabled={!canCancel}
                                variant="outline"
                                className={`w-full md:w-auto px-6 py-2 h-auto text-[11px] font-bold uppercase tracking-widest rounded-xl border-slate-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 ${!canCancel ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                                title={restrictionMessage}
                            >
                                Cancel
                            </Button>
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
