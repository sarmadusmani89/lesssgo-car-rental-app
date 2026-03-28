'use client';

import { formatDashboardDate } from '@/lib/utils';

export default function CompleteBookingInformation({ booking }: { booking: any }) {
  if (!booking) return null;

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING':
        return 'bg-primary/5 text-primary border-primary/10';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Reference Data</label>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Booking Info</h2>
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(booking.status)}`}>
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Customer</label>
            <p className="text-base font-bold text-slate-900">{booking.customerName || booking.user?.name || 'N/A'}</p>
            <p className="text-xs text-slate-500 font-medium">{booking.customerEmail || booking.user?.email || 'N/A'}</p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Schedule</label>
            <p className="text-sm font-bold text-slate-800">
              {formatDashboardDate(booking.startDate)} <span className="text-slate-300 mx-2">—</span> {formatDashboardDate(booking.endDate)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pickup</label>
              <p className="text-xs font-semibold text-slate-600 uppercase">{booking.pickupLocation || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Return</label>
              <p className="text-xs font-semibold text-slate-600 uppercase">{booking.returnLocation || 'Not specified'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Total Amount</label>
              <p className="text-xl font-extrabold text-primary tracking-tight">K{booking.totalAmount}</p>
            </div>
            <div className="text-right">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Security Bond</label>
              <p className="text-sm font-bold text-slate-700">K{booking.bondAmount}</p>
              <p className={`text-[9px] font-bold uppercase mt-0.5 ${booking.bondStatus === 'PAID' ? 'text-emerald-600' : 'text-slate-400'}`}>
                {booking.bondStatus === 'PAID' ? 'Settled' : booking.paymentMethod === 'ONLINE' ? 'Pay Online (Stripe)' : 'Cash on Collection'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
