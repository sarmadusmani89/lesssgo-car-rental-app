'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Home, BookOpen, Calculator, CreditCard } from 'lucide-react';

function PaymentDeclinedContent() {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                    {/* Header Section */}
                    <div className="bg-amber-500 p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-amber-500 mb-8 shadow-2xl shadow-amber-900/20 rotate-6 transition-transform hover:rotate-0 duration-500">
                                <AlertCircle size={48} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-4 leading-none">
                                Payment <span className="opacity-60 text-white">Declined</span>
                            </h1>
                            <p className="text-amber-100 font-bold uppercase tracking-[0.2em] text-[10px]">Transaction was not authorized</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Context Section */}
                        <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 space-y-4">
                            <div className="flex items-center gap-3 text-amber-600">
                                <CreditCard size={20} />
                                <span className="font-black uppercase text-xs tracking-widest">Why was this declined?</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                Your card issuer has declined this transaction. Common reasons include insufficient funds, card limits, or international transaction restrictions.
                            </p>
                            {order && (
                                <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Order Reference</span>
                                    <span className="text-xs font-mono font-bold text-amber-600">#{order}</span>
                                </div>
                            )}
                        </div>

                        {/* Recommendation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
                                    <Calculator size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Step 1</span>
                                    <p className="text-xs font-bold text-gray-600">Check your balance and transaction limits with your bank.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Step 2</span>
                                    <p className="text-xs font-bold text-gray-600">Ensure your card is enabled for online payments.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.href = '/checkout'}
                                className="flex-1 px-8 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                            >
                                <ArrowLeft size={16} />
                                Try Different Card
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-8 py-5 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-50 flex items-center justify-center gap-3"
                            >
                                <Home size={16} />
                                <span className="uppercase text-[10px] tracking-widest">Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentDeclinedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-amber-500">
                    <CreditCard size={48} />
                </div>
            </div>
        }>
            <PaymentDeclinedContent />
        </Suspense>
    );
}
