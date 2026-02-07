'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Calendar, Car, CreditCard, ArrowRight, Printer, Home } from 'lucide-react';
import Link from 'next/link';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const carName = searchParams.get('carName') || 'Vehicle';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const total = searchParams.get('total');
    const payment = searchParams.get('payment') || 'pickup';

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-40 pb-20 print:bg-white print:pt-0 print:block">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden relative print:shadow-none print:border-gray-200 print:mx-auto">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600 print:hidden" />

                <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 text-green-500 rounded-full mb-8 shadow-inner print:bg-transparent">
                        <CheckCircle2 size={48} />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 font-outfit uppercase tracking-tight mb-4">
                        Reservation <span className="text-blue-600">Confirmed!</span>
                    </h1>
                    <p className="text-gray-500 font-medium text-lg mb-12 print:mb-6">
                        Your professional rental is ready. We've sent the confirmation details to your email.
                    </p>

                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 text-left space-y-6 print:bg-white">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                    <Car size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vehicle</p>
                                    <p className="font-bold text-gray-900 tracking-tight">{carName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
                                <p className="font-black text-blue-600 text-xl">${total || '0.00'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pickup</p>
                                        <p className="font-bold text-gray-900 text-sm">{formatDate(startDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Method</p>
                                        <p className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                                            {payment?.toUpperCase() === 'STRIPE' ? 'Stripe Secure' : 'Payment at Pickup'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return</p>
                                        <p className="font-bold text-gray-900 text-sm">{formatDate(endDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="font-bold text-green-600 text-sm uppercase tracking-tight">Booked</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 print:hidden">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-3"
                        >
                            <Printer size={16} />
                            Print Receipt
                        </button>
                        <Link
                            href="/"
                            className="flex-1 py-4 border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                        >
                            <Home size={16} />
                            Back Home
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs font-bold uppercase tracking-[0.3em] print:hidden">
                Exquisite Fleet <span className="text-blue-600/50">Professional Services</span>
            </p>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <CheckCircle2 size={48} className="text-blue-100" />
                    <div className="h-4 w-32 bg-gray-100 rounded-full" />
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
