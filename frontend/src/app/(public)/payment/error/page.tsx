'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Home, Mail, ChevronRight, HelpCircle, ShieldClose } from 'lucide-react';

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');

    const errorMap: Record<string, { title: string, message: string }> = {
        'signature_mismatch': {
            title: 'Security Mismatch',
            message: 'A security verification error occurred. Our internal safeguards have blocked this transaction for your protection.'
        },
        'order_not_found': {
            title: 'Ref Not Found',
            message: 'We could not locate your reservation reference in our system after the payment attempt.'
        },
        'server_error': {
            title: 'System Fault',
            message: 'Our servers encountered an unexpected issue while processing your payment confirmation.'
        },
        'default': {
            title: 'Generic Fault',
            message: 'An unknown system error occurred during the payment flow. No funds were captured.'
        }
    };

    const { title, message } = errorMap[reason || 'default'] || errorMap['default'];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                    {/* Header Section */}
                    <div className="bg-gray-900 p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-gray-900 mb-8 shadow-2xl shadow-black/20 transition-transform hover:scale-110 duration-500">
                                <ShieldClose size={48} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-4 leading-none">
                                {title.split(' ')[0]} <span className="opacity-40">{title.split(' ')[1] || 'Error'}</span>
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Critical system exception</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        {/* Error Message */}
                        <div className="text-center space-y-4">
                            <p className="text-gray-600 font-medium leading-relaxed max-w-sm mx-auto italic">
                                "{message}"
                            </p>
                        </div>

                        {/* Contact Support Section */}
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 font-outfit">Immediate Assistance</h3>
                                <HelpCircle size={16} className="text-blue-600" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase text-gray-400">Email Support</p>
                                        <p className="text-sm font-bold text-gray-900">ride@lessssgopng.com</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 px-8 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                            >
                                <Home size={16} />
                                Return Home
                            </button>
                            <button
                                onClick={() => window.location.href = '/contact'}
                                className="px-8 py-5 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-50 flex items-center justify-center gap-3"
                            >
                                <span className="uppercase text-[10px] tracking-widest text-center">Contact Us</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-gray-900">
                    <AlertTriangle size={48} />
                </div>
            </div>
        }>
            <PaymentErrorContent />
        </Suspense>
    );
}
