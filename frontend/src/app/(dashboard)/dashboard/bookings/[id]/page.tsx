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
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <Loader2 size={40} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Booking not found</h2>
        <Button href="/dashboard/bookings" variant="secondary" className="mt-4">
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking <span className="text-primary">Details</span></h1>
          <p className="text-slate-500 mt-1 font-medium">Review and manage your vehicle reservation <span className="text-slate-900 font-bold">#{booking.id.toString().slice(-8).toUpperCase()}</span>.</p>
        </div>
        
        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
          <Button
            onClick={handleCancel}
            disabled={!isCancellable}
            variant="danger"
            className={`px-8 py-4 rounded-2xl ${!isCancellable ? 'opacity-40 grayscale pointer-events-none' : ''}`}
            title={
              !isFreeCancellation
                ? "This car does not offer free cancellation"
                : !isTimeValid
                  ? "Cancellations are only allowed 48 hours before pickup"
                  : "Cancel Booking"
            }
          >
            {!isFreeCancellation
              ? 'Non-Cancellable'
              : !isTimeValid
                ? 'Cancellation Restricted'
                : 'Cancel Booking'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CompleteBookingInformation booking={booking} />
          <PaymentStatusAndMethod booking={booking} />
        </div>
        <div className="space-y-8">
          <CarDetailsWithImages car={booking.car} />
          <BookingStatusTimeline booking={booking} />
        </div>
      </div>
    </div>
  );

}
