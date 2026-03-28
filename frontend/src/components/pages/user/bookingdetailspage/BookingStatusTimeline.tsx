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
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="mb-6">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Log</label>
        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Timeline</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`mt-1 flex-shrink-0 ${step.status === 'completed' ? 'text-emerald-500' : step.status === 'active' ? 'text-primary' : 'text-slate-300'}`}>
              {step.icon}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-tight ${step.status === 'active' ? 'text-primary' : 'text-slate-900'}`}>
                {step.title}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {step.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
