'use client';

import { Calendar, User, MapPin } from 'lucide-react';
import { formatDashboardDate } from '@/lib/utils';

export default function CompleteBookingInformation({ booking }: { booking: any }) {
  if (!booking) return null;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          <span>Customer Name: {booking.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-500" />
          <span>Dates: {formatDashboardDate(booking.startDate)} - {formatDashboardDate(booking.endDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-red-500" />
          <span>Pickup Location: <span className="font-bold uppercase">{booking.pickupLocation || 'Not specified'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-orange-500" />
          <span>Return Location: <span className="font-bold uppercase">{booking.returnLocation || 'Not specified'}</span></span>
        </div>
        <div>
          <span className="font-medium text-gray-500">Booking ID:</span>
          <span className="ml-2 font-mono font-bold text-slate-400">
            #{booking.id.toString().slice(-8).toUpperCase()}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-500">Total Amount:</span>
          <span className="ml-2 font-bold text-blue-600">K${booking.totalAmount}</span>
        </div>
        <div>
          <span className="font-medium text-gray-500">Status:</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {booking.status}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-500">Phone:</span>
          <span className="ml-2">{booking.customerPhone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
