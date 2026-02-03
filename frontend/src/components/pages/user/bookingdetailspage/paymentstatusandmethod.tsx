'use client';

import { CreditCard, Sparkles } from 'lucide-react';

export default function PaymentStatusAndMethod() {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-green-500" />
          <span>Payment Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-blue-500" />
          <span>Payment Method: Credit Card</span>
        </div>
      </div>
    </div>
  );
}
