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
                // Fetch booking details by session_id
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
                setError("Could not load latest booking details automatically. Please check your bookings page.");
                toast.error("Could not load latest booking details automatically.");
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Confirming your reservation...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white text-center">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
                    <Receipt size={40} />
                </div>
                <h1 className="text-2xl font-black font-outfit uppercase tracking-tight text-gray-900 mb-4">Something went wrong</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">{error}</p>
                <Button
                    href="/dashboard/bookings"
                    variant="primary"
                    size="lg"
                    className="w-full text-[10px] tracking-widest font-black uppercase py-5"
                >
                    Review My Bookings
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className="max-w-4xl w-full">
                {/* Main Success Card */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                    <div className="bg-primary p-12 text-center text-primary-foreground relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/20 rotate-12 transition-transform hover:rotate-0 duration-500">
                                <CheckCircle2 size={48} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-4 leading-none">
                                Reservation <span className="opacity-60 text-primary-foreground">Confirmed</span>
                            </h1>
                            <p className="text-primary-foreground/80 font-bold uppercase tracking-[0.2em] text-[10px]">Your legendary journey begins here</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Selected Vehicle</span>
                                        <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">{carName || 'Vehicle'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
                                        <Receipt size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                            Grand Total {bookingData.paymentStatus === 'PAID' || bookingData.paymentStatus === 'CONFIRMED' ? '(Paid)' : '(To Be Paid)'}
                                        </span>
                                        <div className="space-y-1">
                                            <p className="text-2xl font-black text-primary font-outfit uppercase tracking-tight">
                                                {formatPrice(Number(total || 0) + Number(bond || 0), currency as any, rates)}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                                (Rental: {formatPrice(Number(total || 0), currency as any, rates)} + Bond: {formatPrice(Number(bond || 0), currency as any, rates)})
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
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
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Settlement Method</span>
                                        <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">
                                            {payment === 'ONLINE' ? 'Pay Online (Stripe)' : payment === 'CARD' ? 'Card on Collection' : 'Cash on Collection'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="border-t border-gray-100 pt-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary">
                                        <ArrowRight size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Next Destination?</h3>
                                        <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Check your email for full details</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <Button
                                        href="/dashboard/bookings"
                                        variant="primary"
                                        className="flex-1 md:flex-none px-8 py-5 text-[10px] tracking-widest font-black uppercase shadow-xl h-auto"
                                    >
                                        Manage Bookings
                                    </Button>
                                    <Button
                                        href="/"
                                        variant="outline"
                                        size="icon"
                                        className="p-5 border border-gray-100 shadow-xl shadow-gray-50 h-auto w-auto"
                                    >
                                        <Home size={20} />
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-primary">
                    <Clock size={48} />
                </div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
