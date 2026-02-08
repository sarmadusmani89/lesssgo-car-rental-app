import { Eye } from 'lucide-react';
import Link from 'next/link';

export default function RecentBookingsTable({ bookings }: { bookings: any[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 font-outfit">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View All
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Car</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings?.length > 0 ? (
                            bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-400">
                                        #{b.id.toString().slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{b.customerName || b.user?.name}</span>
                                            <span className="text-xs text-gray-500">{b.customerEmail || b.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">
                                                {b.car?.brand}
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 uppercase leading-tight">
                                                {b.car?.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            b.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">K{b.totalAmount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/bookings/${b.id}`}
                                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <Eye size={16} />
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                    No recent bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
