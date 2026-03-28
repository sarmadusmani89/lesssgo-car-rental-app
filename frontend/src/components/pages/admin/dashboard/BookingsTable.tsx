'use client';

import { Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecentBookingsTable({ bookings }: { bookings: any[] }) {
    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED':
            case 'COMPLETED':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PENDING':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CANCELLED':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
                <Link
                    href="/admin/bookings"
                    className="text-xs font-semibold text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-50">
                        <tr>
                            <th className="px-6 py-4">Reference</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Vehicle</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {bookings?.length > 0 ? (
                            bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-medium">
                                        #{b.id.toString().slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 text-sm">{b.customerName || b.user?.name}</span>
                                            <span className="text-[11px] text-slate-400 font-medium">{b.customerEmail || b.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-primary uppercase leading-none mb-1">
                                                {b.car?.brand}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700 leading-none">
                                                {b.car?.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(b.status)}`}>
                                            {b.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">K{b.totalAmount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/bookings/${b.id}`}
                                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                                    Awaiting new reservations
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
