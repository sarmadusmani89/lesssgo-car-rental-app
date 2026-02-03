'use client';

import { Calendar, User } from 'lucide-react';

export default function CompleteBookingInformation() {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          <span>Customer Name: John Doe</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-500" />
          <span>Booking Date: 2026-02-05</span>
        </div>
        <div>
          <span>Booking ID: #12345</span>
        </div>
        <div>
          <span>Booking Status: Active</span>
        </div>
      </div>
    </div>
  );
}
