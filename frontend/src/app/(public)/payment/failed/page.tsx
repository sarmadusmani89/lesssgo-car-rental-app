'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, Home, RefreshCcw, ShieldAlert, CreditCard, Calendar } from 'lucide-react';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentAdvice from '@/components/pages/payment/PaymentAdvice';
import PaymentActions from '@/components/pages/payment/PaymentActions';
import { getKinaError } from '@/lib/kina-errors';

function PaymentFailedContent() {
    const searchParams = useSearchParams();
    const order = searchParams.get('order');
    const rc = searchParams.get('rc');

    const { title, message } = getKinaError(rc);

    // Override generic subtitle for specific cases if desired
    let subtitle = "A technical error occurred";
    if (rc === '-25') subtitle = "Transaction stopped by user";
    if (rc === '-19') subtitle = "Security check failed";

    return (
        <PaymentStatusLayout maxWidth="max-w-2xl">
            <PaymentStatusHeader
                icon={XCircle}
                title={title}
                subtitle={subtitle}
                variant="failed"
                iconRotate="-rotate-12"
            />

            <div className="p-8 md:p-12 space-y-10">
                <PaymentAdvice
                    variant="failed"
                    contextIcon={ShieldAlert}
                    contextTitle="Specific Details"
                    contextText={message}
                    orderId={order || undefined}
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
