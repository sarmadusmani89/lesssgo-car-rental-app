"use client";

import { useEffect, useState } from 'react';
import {
    CreditCard,
    Download,
    Search,
    Filter,
    ExternalLink,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currency = useSelector((state: RootState) => state.ui.currency);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.id) {
                    const { data } = await api.get(`/payment/user/${user.id}`);
                    setPayments(data);
                }
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium font-outfit">Loading your transactions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">Payments</h1>
                <p className="text-gray-500 mt-1">Manage your billing and transaction history.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by transaction ID..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900 line-clamp-1">#TRX-{payment.id.slice(-8).toUpperCase()}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">{payment.paymentMethod || 'ONLINE'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(payment.createdAt).toLocaleDateString('en-AU', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            timeZone: 'UTC'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {formatPrice(payment.amount, currency)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${payment.status === 'PAID' ? 'bg-green-50 text-green-600' :
                                            payment.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {payment.status === 'PAID' ? <CheckCircle2 size={12} /> :
                                                payment.status === 'PENDING' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No transaction history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
