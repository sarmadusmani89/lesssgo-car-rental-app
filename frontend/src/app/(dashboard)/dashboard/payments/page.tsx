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
import { formatPrice, formatDashboardDate } from '@/lib/utils';
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments</h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your billing and transaction history.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {payments.length > 0 ? payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 tracking-tight">#TRX-{payment.id.slice(-8).toUpperCase()}</div>
                                                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                    {payment.paymentMethod === 'ONLINE' ? 'Pay Online (Stripe)' : payment.paymentMethod === 'CARD' ? 'Card on Collection' : 'Cash on Collection'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                        {formatDashboardDate(payment.createdAt)}
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-900 text-sm">
                                        {formatPrice(payment.amount, currency)}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            payment.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                                            payment.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            {payment.status === 'PAID' ? <CheckCircle2 size={12} /> :
                                             payment.status === 'PENDING' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center">
                                        <p className="text-slate-400 font-medium">No transaction history available yet.</p>
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
