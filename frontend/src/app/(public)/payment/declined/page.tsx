'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowLeft, Home, BookOpen, Calculator, CreditCard } from 'lucide-react';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentAdvice from '@/components/pages/payment/PaymentAdvice';
import PaymentActions from '@/components/pages/payment/PaymentActions';

function PaymentDeclinedContent() {
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
                icon={AlertCircle}
                title="Payment Declined"
                subtitle="Transaction was not authorized"
                variant="declined"
                iconRotate="rotate-6"
            />

            <div className="p-8 md:p-12 space-y-10">
                <PaymentAdvice
                    variant="declined"
                    contextIcon={CreditCard}
                    contextTitle="Why was this declined?"
                    contextText="Your card issuer has declined this transaction. Common reasons include insufficient funds, card limits, or international transaction restrictions."
                    orderId={order}
                    adviceItems={[
                        {
                            icon: Calculator,
                            label: 'Step 1',
                            text: 'Check your balance and transaction limits with your bank.'
                        },
                        {
                            icon: BookOpen,
                            label: 'Step 2',
                            text: 'Ensure your card is enabled for online payments.'
                        }
                    ]}
                />

                <PaymentActions
                    actions={[
                        {
                            label: 'Use Another Card',
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
