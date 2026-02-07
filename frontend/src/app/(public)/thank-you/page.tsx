'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, MapPin, CreditCard, ArrowRight, Home, ChevronRight, Car, Receipt, Clock } from 'lucide-react';
import { formatPrice, formatDashboardDate } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const { currency, rates } = useSelector((state: RootState) => state.ui);
    const { carName, startDate, endDate, total, payment } = Object.fromEntries(searchParams.entries());

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        return formatDashboardDate(dateStr);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="max-w-4xl w-full">
                {/* Main Success Card */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                    <div className="bg-blue-600 p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-blue-600 mb-8 shadow-2xl shadow-blue-900/20 rotate-12 transition-transform hover:rotate-0 duration-500">
                                <CheckCircle2 size={48} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-4 leading-none">
                                Reservation <span className="opacity-60 text-white">Confirmed</span>
                            </h1>
                            <p className="text-blue-100 font-bold uppercase tracking-[0.2em] text-[10px]">Your legendary journey begins here</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Selected Vehicle</span>
                                        <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">{carName || 'Vehicle'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                        <Receipt size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Investment Total</span>
                                        <p className="text-xl font-black text-blue-600 font-outfit uppercase tracking-tight">
                                            {formatPrice(Number(total || 0), currency as any, rates)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                        <Clock size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Rental Period</span>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-gray-400">PICKUP</span>
                                                <span className="text-[10px] font-black text-gray-900">{formatDate(startDate)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                <span className="text-[10px] font-bold text-gray-400">RETURN</span>
                                                <span className="text-[10px] font-black text-gray-900">{formatDate(endDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Settlement Method</span>
                                        <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">{payment === 'CASH' ? 'Pay on Collection' : 'Online Payment'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="border-t border-gray-100 pt-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <ArrowRight size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Next Destination?</h3>
                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Check your email for full details</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <button
                                        onClick={() => window.location.href = '/dashboard/bookings'}
                                        className="flex-1 md:flex-none px-8 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
                                    >
                                        Manage Bookings
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="p-5 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-50"
                                    >
                                        <Home size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-blue-600">
                    <Clock size={48} />
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
