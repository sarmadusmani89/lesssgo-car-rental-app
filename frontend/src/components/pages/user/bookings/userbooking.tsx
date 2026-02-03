'use client';

import { useState } from 'react';

interface Booking {
  id: number;
  title: string;
  date: string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
}

const sampleBookings: Booking[] = [
  { id: 1, title: 'Car Booking 1', date: '2026-02-05', status: 'Upcoming' },
  { id: 2, title: 'Car Booking 2', date: '2026-01-25', status: 'Completed' },
  { id: 3, title: 'Car Booking 3', date: '2026-02-01', status: 'Active' },
  { id: 4, title: 'Car Booking 4', date: '2026-01-20', status: 'Cancelled' },
];

export default function UserBookings() {
  const [tab, setTab] = useState<'Upcoming' | 'Active' | 'Completed' | 'Cancelled'>('Upcoming');

  const filteredBookings = sampleBookings.filter((b) => b.status === tab);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-4">
        {['Upcoming', 'Active', 'Completed', 'Cancelled'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as typeof tab)}
            className={`px-4 py-2 font-medium ${
              tab === t ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 && <p className="text-gray-500">No bookings in this tab.</p>}

        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white shadow rounded-lg"
          >
            <div className="mb-2 md:mb-0">
              <p className="font-semibold">{booking.title}</p>
              <p className="text-sm text-gray-500">{booking.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                View Details
              </button>
              {booking.status !== 'Cancelled' && (
                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                  Cancel
                </button>
              )}
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Download Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
