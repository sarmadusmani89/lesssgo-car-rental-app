'use client';

import React from 'react';
import { Calendar, Search, Filter, MoreHorizontal } from 'lucide-react';

export default function AdminBookings() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 italic">Booking Management</h1>
                    <p className="text-slate-500 mt-1">Review and manage all customer reservations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={20} />
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm font-medium">
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#BK-100{i}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">John Doe</td>
                                    <td className="px-6 py-4 text-slate-600">Tesla Model 3</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-600 border border-green-100">Confirmed</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm italic">Oct 24 - Oct 27</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">$450.00</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium italic">Showing 5 of 86 bookings</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Previous</button>
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
