'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/CompleteBookingInformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/CarDetailsWithImages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/PaymentStatusAndMethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/BookingStatusTimeline';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
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
          href="/dashboard/bookings" 
          variant="secondary" 
          className="mt-8 px-8 py-2.5 h-auto rounded-xl text-[11px] font-bold uppercase tracking-widest bg-slate-100 text-slate-900 hover:bg-slate-200"
        >
          Back to Bookings
        </Button>
      </div>
    );
  }

  const handleCancel = async () => {
    try {
      if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
      await api.patch(`/booking/${id}`, { status: 'CANCELLED' });
      toast.success('Booking cancelled successfully');
      const res = await api.get(`/booking/${id}`);
      setBooking(res.data);
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const pickupDate = new Date(booking.startDate);
  const now = new Date();
  const hoursDifference = (pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isFreeCancellation = booking.car?.freeCancellation ?? true;
  const isTimeValid = hoursDifference >= 48;
  const isCancellable = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && isFreeCancellation && isTimeValid;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Booking <span className="text-primary">Details</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Review your reservation <span className="text-slate-900 font-bold">#{booking.id.toString().slice(-8).toUpperCase()}</span> details.</p>
        </div>
        
        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
          <Button
            onClick={handleCancel}
            disabled={!isCancellable}
            variant="outline"
            className={`px-6 py-2.5 h-auto text-[11px] font-bold uppercase tracking-widest rounded-xl border-slate-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-100 ${!isCancellable ? 'opacity-30 grayscale pointer-events-none' : ''}`}
          >
            {!isFreeCancellation
              ? 'Non-Cancellable'
              : !isTimeValid
                ? 'Cancellation Restricted'
                : 'Cancel Booking'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <CompleteBookingInformation booking={booking} />
          <PaymentStatusAndMethod booking={booking} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <CarDetailsWithImages car={booking.car} />
          <BookingStatusTimeline booking={booking} />
        </div>
      </div>
    </div>
  );

}
