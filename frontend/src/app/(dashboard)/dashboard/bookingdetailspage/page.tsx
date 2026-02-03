'use client';

import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/completebookinginformation';
import CarDetailsWithImages from '@/components/pages/user/bookingdetailspage/cardetailswithimages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/paymentstatusandmethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/bookingstatustimeline';

export default function BookingDetailsPage() {
  return (
    <div className="space-y-6">
      <CompleteBookingInformation />
      <CarDetailsWithImages />
      <PaymentStatusAndMethod />
      <BookingStatusTimeline />
    </div>
  );
}
