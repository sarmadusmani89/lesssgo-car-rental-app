'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, Home, RefreshCcw, ShieldAlert, CreditCard } from 'lucide-react';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentAdvice from '@/components/pages/payment/PaymentAdvice';
import PaymentActions from '@/components/pages/payment/PaymentActions';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
    const carId = searchParams.get('id');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const pickupLocation = searchParams.get('pickupLocation');
    const returnLocation = searchParams.get('returnLocation');

    const checkoutUrl = `/checkout?${new URLSearchParams({
        id: carId || '',
        startDate: startDate || '',
        endDate: endDate || '',
        pickupLocation: pickupLocation || '',
        returnLocation: returnLocation || '',
    }).toString()}`;

    return (
        <PaymentStatusLayout maxWidth="max-w-2xl">
            <PaymentStatusHeader
                icon={XCircle}
                title="Payment Failed"
                subtitle="A technical error occurred"
                variant="failed"
                iconRotate="-rotate-12"
            />

            <div className="p-8 md:p-12 space-y-10">
                <PaymentAdvice
                    variant="failed"
                    contextIcon={ShieldAlert}
                    contextTitle="Technical details"
                    contextText="We're sorry, but your transaction could not be processed at this time. This is often due to a temporary connection issue with the bank's authorization system."
                    orderId={order}
                    adviceItems={[
                        {
                            icon: RefreshCcw,
                            label: 'Solution 1',
                            text: 'Please wait a few moments and try your reservation again.'
                        },
                        {
                            icon: CreditCard,
                            label: 'Solution 2',
                            text: 'Consider using a different card or payment method.'
                        }
                    ]}
                />

                <PaymentActions
                    actions={[
                        {
                            label: 'Try Reservation Again',
                            onClick: () => window.location.href = checkoutUrl,
                            variant: 'primary',
                            colorClass: 'bg-gray-900',
                            icon: ArrowLeft
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

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin text-red-600">
                    <RefreshCcw size={48} />
                </div>
            </div>
        }>
            <PaymentFailedContent />
        </Suspense>
    );
}
