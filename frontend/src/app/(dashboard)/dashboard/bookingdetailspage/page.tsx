'use client';

import CompleteBookingInformation from '@/components/pages/user/bookingdetailspage/completebookinginformation';
import VehicleDetailsWithImages from '@/components/pages/user/bookingdetailspage/vehicledetailswithimages';
import PaymentStatusAndMethod from '@/components/pages/user/bookingdetailspage/paymentstatusandmethod';
import BookingStatusTimeline from '@/components/pages/user/bookingdetailspage/bookingstatustimeline';

export default function BookingDetailsPage() {
  return (
    <div className="space-y-6">
      <CompleteBookingInformation />
      <VehicleDetailsWithImages />
      <PaymentStatusAndMethod />
      <BookingStatusTimeline />
    </div>
  );
}
