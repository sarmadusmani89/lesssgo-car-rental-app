// app/admin/bookings/ViewDetailsModal.tsx
"use client";
import { Booking } from "../../../../types/booking";

type Props = {
  booking: Booking | null;
  onClose: () => void;
};

export default function ViewDetailsModal({ booking, onClose }: Props) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
          <p><span className="font-semibold">Customer:</span> {booking.customerName || booking.user?.name || 'N/A'}</p>
          <p><span className="font-semibold">Email:</span> {booking.customerEmail || booking.user?.email}</p>
          <p><span className="font-semibold">Phone:</span> {booking.customerPhone || booking.user?.phoneNumber || 'N/A'}</p>
          <p><span className="font-semibold">Vehicle:</span> {booking.car?.name || 'N/A'}</p>
          <p><span className="font-semibold">Status:</span> {booking.status}</p>
          <p><span className="font-semibold">Payment:</span> {booking.paymentStatus}</p>
          <p><span className="font-semibold">Amount:</span> K{booking.totalAmount}</p>
          <p><span className="font-semibold">From:</span> {booking.startDate}</p>
          <p><span className="font-semibold">To:</span> {booking.endDate}</p>
        </div>
      </div>
    </div>
  );
}
