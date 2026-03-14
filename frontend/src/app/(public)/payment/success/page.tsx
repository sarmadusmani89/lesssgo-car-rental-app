'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, LayoutDashboard, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { toast } from 'sonner';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentSummary from '@/components/pages/payment/PaymentSummary';
import PaymentActions from '@/components/pages/payment/PaymentActions';

function SuccessContent() {
    const searchParams = useSearchParams();
    const { currency, rates } = useSelector((state: RootState) => state.ui);
    const params = Object.fromEntries(searchParams.entries());

    const [bookingData, setBookingData] = useState<any>(params);
    const [loading, setLoading] = useState(!!params.session_id);

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
                    total: b.totalAmount,
                    bond: b.bondAmount || 0,
                    payment: b.paymentMethod,
                    paymentStatus: b.paymentStatus
                });
            } catch (err) {
                console.error("Failed to fetch booking from session:", err);
                toast.error("Could not load latest booking details automatically.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionBooking();
    }, [params.session_id]);

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
                title="Reservation Confirmed"
                subtitle="Your legendary journey begins here"
                variant="success"
                iconRotate="rotate-12"
            />

            <div className="p-8 md:p-12 space-y-12">
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
                    footerTitle="Next Destination?"
                    footerSubtitle="Check your email for full details"
                    actions={[
                        {
                            label: 'See My Bookings',
                            onClick: () => window.location.href = '/dashboard/bookings',
                            variant: 'primary',
                            colorClass: 'bg-gray-900',
                            icon: LayoutDashboard
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
