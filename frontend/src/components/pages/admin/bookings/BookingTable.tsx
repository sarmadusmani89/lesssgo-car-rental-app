'use client';

import React from 'react';
import { Booking, BookingStatus } from '../../../../types/booking';
import { StatusBadge } from '../../../ui/StatusBadge';
import {
  Calendar,
  User,
  Car,
  ExternalLink,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../../lib/utils';

interface BookingTableProps {
  bookings: Booking[];
  onStatusUpdate: (id: string, status: BookingStatus) => void;
  onConfirmPayment: (id: string) => void;
  onViewDetails: (booking: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, onStatusUpdate, onConfirmPayment, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-medium uppercase tracking-wider">
              <th className="px-6 py-4">Booking</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Car</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Payment</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        #{booking.id.slice(-8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-bold italic">
                        <Calendar size={12} className="text-blue-500" />
                        {new Date(booking.startDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', timeZone: 'UTC' })} -
                        {new Date(booking.endDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{booking.customerName || booking.user?.name || 'Valued Customer'}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{booking.customerEmail || booking.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Car size={16} className="text-slate-400" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">
                          {booking.car?.brand}
                        </span>
                        <span className="text-sm font-bold text-slate-700 uppercase leading-tight">
                          {booking.car?.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={booking.status} type="booking" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">
                    K${booking.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(booking.id, BookingStatus.CONFIRMED)}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Confirm Booking"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => onStatusUpdate(booking.id, BookingStatus.CANCELLED)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && booking.paymentStatus !== 'PAID' && (
                        <button
                          onClick={() => onConfirmPayment(booking.id)}
                          className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg rounded-lg transition-all text-xs font-bold border border-slate-900"
                          title="Confirm Payment Received"
                        >
                          Payment Received
                        </button>
                      )}
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
