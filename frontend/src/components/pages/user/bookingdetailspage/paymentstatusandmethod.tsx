'use client';

import { CreditCard, Sparkles } from 'lucide-react';

export default function PaymentStatusAndMethod({ booking }: { booking: any }) {
  if (!booking) return null;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Payment Status & Method</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className={booking.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-500'} />
          <span className="font-medium">Status: {booking.paymentStatus}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-blue-500" />
          <span className="font-medium">Method: {booking.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}
