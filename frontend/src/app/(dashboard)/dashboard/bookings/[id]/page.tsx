'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/completebookinginformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/cardetailswithimages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/paymentstatusandmethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/bookingstatustimeline';

export default function BookingDetailsPage() {
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-outfit">Booking Details</h1>
      <CompleteBookingInformation booking={booking} />
      <CarDetailsWithImages car={booking.car} />
      <PaymentStatusAndMethod booking={booking} />
      <BookingStatusTimeline booking={booking} />
    </div>
  );
}
