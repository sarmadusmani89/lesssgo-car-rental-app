'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Calendar, MapPin, CreditCard, ArrowRight, Home, ChevronRight, Car, Receipt, Clock, Loader2 } from 'lucide-react';
import { formatPrice, formatDashboardDate } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';

function ThankYouContent() {
    const searchParams = useSearchParams();
    const { currency, rates } = useSelector((state: RootState) => state.ui);
    const params = Object.fromEntries(searchParams.entries());

    const [bookingData, setBookingData] = useState<any>(params);
    const [loading, setLoading] = useState(!!params.session_id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessionBooking = async () => {
            if (!params.session_id) return;

            try {
                setLoading(true);
                const res = await api.get(`/booking/session/${params.session_id}`);
                const b = res.data;

                setBookingData({
                    carName: `${b.car.brand} ${b.car.name}`,
                    startDate: b.startDate,
                    endDate: b.endDate,
                    total: b.totalAmount.toString(),
                    bond: (b.bondAmount || 0).toString(),
                    payment: b.paymentMethod,
                    paymentStatus: b.paymentStatus
                });
            } catch (err) {
                console.error("Failed to fetch booking from session:", err);
                setError("Could not load latest booking details automatically.");
                toast.error("Could not load booking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionBooking();
    }, [params.session_id]);

    const { carName, startDate, endDate, total, bond, payment } = bookingData;

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'TBD';
        return formatDashboardDate(dateStr);
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing Registry</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                    <Receipt size={32} />
                </div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Process Error</h1>
                <p className="text-slate-500 text-xs mb-8 leading-relaxed font-semibold uppercase tracking-wide">{error}</p>
                <Button
                    href="/dashboard/bookings"
                    variant="primary"
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    Review My Bookings
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-40 pb-40">
            <div className="max-w-3xl w-full">
                {/* Main Success Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
                    <div className="bg-primary p-10 text-center text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-xl shadow-primary/20 transition-transform rotate-6">
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-2 leading-none">
                                Reservation <span className="opacity-60 text-primary-foreground">Confirmed</span>
                            </h1>
                            <p className="text-primary-foreground/60 font-black uppercase tracking-[0.3em] text-[9px]">Platform Operations Finalized</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-10">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                                        <Car size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 block">Vehicle Details</span>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{carName || 'Vehicle Selected'}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                                        <Receipt size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 block">Total Payment (Rental + Bond)</span>
                                        <div className="flex flex-col">
                                            <p className="text-lg font-black text-primary tracking-tight">
                                                {formatPrice(Number(total || 0) + Number(bond || 0), currency as any, rates)}
                                            </p>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                                (Rental: {formatPrice(Number(total || 0), currency as any, rates)} + Bond: {formatPrice(Number(bond || 0), currency as any, rates)})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                                        <Clock size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Rental Period</span>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Pickup</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">{formatDate(startDate)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Return</span>
                                                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">{formatDate(endDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 block">Payment Method</span>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                            {payment === 'ONLINE' ? 'Pay Online (Stripe)' : 'Cash on Collection'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="border-t border-slate-100 pt-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-primary shadow-sm">
                                        <ArrowRight size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest">Next Steps</h3>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Check your email for details</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <Button
                                        href="/dashboard/bookings"
                                        variant="primary"
                                        className="flex-1 md:flex-none px-8 py-5 text-[10px] tracking-widest font-black uppercase shadow-xl shadow-primary/10 h-auto"
                                    >
                                        Manage Bookings
                                    </Button>
                                    <Button
                                        href="/"
                                        variant="outline"
                                        className="p-5 border border-slate-100 bg-white h-auto w-auto transition-transform hover:scale-110"
                                    >
                                        <Home size={18} className="text-slate-400" />
                                    </Button>
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 animate-pulse">
                    <Clock size={24} className="text-primary/40 animate-spin" />
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
