'use client';

import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react';

export default function BookingStatusTimeline({ booking }: { booking: any }) {
  if (!booking) return null;

  const formatDate = (date: any) => {
    return new Date(date).toLocaleString('en-AU', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const steps = [
    {
      title: 'Booking Requested',
      status: 'completed',
      date: formatDate(booking.createdAt),
      icon: <CheckCircle2 size={16} />
    },
    {
      title: booking.status === 'CANCELLED' ? 'Booking Cancelled' : `Status: ${booking.status}`,
      status: booking.status === 'CANCELLED' ? 'cancelled' : (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'completed' : 'active'),
      date: formatDate(booking.status === 'CANCELLED' ? (booking.cancelledAt || booking.updatedAt) : booking.updatedAt),
      icon: booking.status === 'CANCELLED' ? <XCircle size={16} /> : (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Clock size={16} />)
    },
    {
      title: `Payment: ${booking.paymentStatus}`,
      status: booking.paymentStatus === 'PAID' ? 'completed' : 'active',
      date: formatDate(booking.paidAt || booking.updatedAt),
      icon: booking.paymentStatus === 'PAID' ? <CheckCircle2 size={16} /> : <Circle size={16} />
    },
  ];

  if (booking.status === 'COMPLETED') {
    steps.push({
      title: 'Rental Finished',
      status: 'completed',
      date: formatDate(booking.completedAt || booking.updatedAt),
      icon: <CheckCircle2 size={16} />
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'active': return 'text-primary bg-primary/5 border-primary/20';
      default: return 'text-slate-300 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="mb-8 pb-4 border-b border-slate-50">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Rental Progress</label>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Timeline</h2>
      </div>

      <div className="space-y-6 relative">
        {/* Subtle vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-slate-50" />

        {steps.map((step, index) => (
          <div key={index} className="relative flex items-start gap-4">
            <div className={`relative z-10 w-[15px] h-[15px] rounded-full border-2 border-white shadow-sm mt-1 transition-colors ${step.status === 'active' ? 'bg-primary' : step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold uppercase tracking-tight ${step.status === 'active' ? 'text-primary' : 'text-slate-900'}`}>
                {step.title}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {step.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
