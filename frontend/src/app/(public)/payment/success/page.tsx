'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, LayoutDashboard, Clock, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentSummary from '@/components/pages/payment/PaymentSummary';
import PaymentActions from '@/components/pages/payment/PaymentActions';

import { submitKinaPaymentForm } from '@/lib/kinaPayment';

function SuccessContent() {
    const searchParams = useSearchParams();
    const { currency, rates } = useSelector((state: RootState) => state.ui);
    const params = Object.fromEntries(searchParams.entries());

    const [bookingData, setBookingData] = useState<any>(params);
    const [loading, setLoading] = useState(true);
    const [bondLoading, setBondLoading] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            const sessionId = params.session_id;
            const bookingId = params.bookingId;

            if (!sessionId && !bookingId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const endpoint = sessionId
                    ? `/booking/session/${sessionId}`
                    : `/booking/${bookingId}`;

                const res = await api.get(endpoint);
                const b = res.data;

                setBookingData({
                    id: b.id,
                    carName: `${b.car.brand} ${b.car.name}`,
                    startDate: b.startDate,
                    endDate: b.endDate,
                    total: b.totalAmount,
                    bond: b.bondAmount || 0,
                    payment: b.paymentMethod,
                    paymentStatus: b.paymentStatus,
                    bondStatus: b.bondStatus
                });
            } catch (err) {
                console.error("Failed to fetch booking details:", err);
                toast.error("Could not load latest booking details automatically.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [params.session_id, params.bookingId]);

    const handleAuthorizeBond = async () => {
        try {
            setBondLoading(true);
            const res = await api.post('/payment/initialize', {
                bookingId: bookingData.id,
                paymentType: 'BOND'
            });
            submitKinaPaymentForm(res.data.gatewayUrl, res.data.fields);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to initialize bond authorization");
            setBondLoading(false);
        }
    };

    const needsBondAuthorization = bookingData.payment === 'ONLINE' && bookingData.bondStatus === 'PENDING';

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!loading && needsBondAuthorization && !bondLoading) {
            timer = setTimeout(() => {
                handleAuthorizeBond();
            }, 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loading, needsBondAuthorization]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin text-blue-600">
                <Clock size={48} />
            </div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Confirming your reservation...</p>
        </div>
    );

    return (
        <PaymentStatusLayout maxWidth="max-w-4xl">
            <PaymentStatusHeader
                icon={CheckCircle2}
                title={needsBondAuthorization ? "Rental Fee Paid" : "Reservation Confirmed"}
                subtitle={needsBondAuthorization ? "Final step: Authorize your security bond" : "Your legendary journey begins here"}
                variant="success"
                iconRotate="rotate-12"
            />

            <div className="p-8 md:p-12 space-y-12">
                {needsBondAuthorization && (
                    <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black font-outfit uppercase tracking-tight text-blue-900">Final Step: Bond Authorization</h3>
                                <p className="text-blue-700/80 text-sm font-medium leading-relaxed">
                                    Rental fee paid! We are now redirecting you to authorize the security bond. 
                                    This is a <strong>hold only</strong>.
                                </p>
                                {!bondLoading && (
                                    <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-blue-600/60 uppercase tracking-widest">
                                        <div className="w-4 h-4 rounded-full border-2 border-t-blue-600 border-blue-100 animate-spin" />
                                        Redirecting in 3 seconds...
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleAuthorizeBond}
                            disabled={bondLoading}
                            className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {bondLoading ? <Clock className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            Secure Bond (PGK {bookingData.bond})
                        </button>
                    </div>
                )}

                <PaymentSummary
                    carName={bookingData.carName}
                    total={Number(bookingData.total || 0)}
                    bond={Number(bookingData.bond || 0)}
                    startDate={bookingData.startDate}
                    endDate={bookingData.endDate}
                    paymentMethod={bookingData.payment}
                    paymentStatus={bookingData.paymentStatus}
                    currency={currency}
                    rates={rates}
                />

                <PaymentActions
                    actions={[
                        {
                            label: 'View Your Bookings',
                            onClick: () => window.location.href = '/dashboard/bookings',
                            variant: 'primary',
                            colorClass: 'bg-gray-900',
                            icon: Calendar
                        },
                        {
                            label: 'Home',
                            onClick: () => window.location.href = '/',
                            variant: 'secondary',
                            icon: Home
                        }
                    ]}
                />
            </div>
        </PaymentStatusLayout>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-blue-600">
                    <Clock size={48} />
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
