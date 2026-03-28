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
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Booking Information</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">General Details & Logistics</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)} shadow-sm`}>
          {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Customer Details</label>
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 tracking-tight">{booking.customerName || booking.user?.name || 'N/A'}</p>
              <p className="text-sm font-medium text-slate-500">{booking.customerEmail || booking.user?.email || 'N/A'}</p>
              <p className="text-sm font-medium text-slate-500">{booking.customerPhone || booking.user?.phoneNumber || 'N/A'}</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Reservation Timeline</label>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Pickup</p>
                <p className="text-sm font-black text-slate-900">{formatDashboardDate(booking.startDate)}</p>
              </div>
              <div className="w-4 h-[2px] bg-slate-100" />
              <div className="px-4 py-2 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Return</p>
                <p className="text-sm font-black text-slate-900">{formatDashboardDate(booking.endDate)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Pickup Location</label>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{booking.pickupLocation || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Return Location</label>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{booking.returnLocation || 'Not specified'}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Total Rental</label>
              <p className="text-2xl font-black text-primary tracking-tighter">K{booking.totalAmount}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-2">Security Bond</label>
              <p className="text-lg font-black text-slate-400 tracking-tighter line-through">K{booking.bondAmount}</p>
              <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Pay on Pickup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
