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

    return (
        <PaymentStatusLayout maxWidth="max-w-4xl">
            <PaymentStatusHeader
                icon={CheckCircle2}
                title="Reservation Confirmed"
                subtitle="Your rental and security bond have been secured. Your journey begins here!"
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
