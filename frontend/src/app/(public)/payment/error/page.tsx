'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Home, Mail, ShieldClose, HelpCircle } from 'lucide-react';

import PaymentStatusLayout from '@/components/pages/payment/PaymentStatusLayout';
import PaymentStatusHeader from '@/components/pages/payment/PaymentStatusHeader';
import PaymentAdvice from '@/components/pages/payment/PaymentAdvice';
import PaymentActions from '@/components/pages/payment/PaymentActions';
import { getKinaError } from '@/lib/kina-errors';

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason');
    const rc = searchParams.get('rc');

    const { title: rcTitle, message: rcMessage } = getKinaError(rc);

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

    const { title, message } = errorMap[reason || 'default'] || (rc ? { title: rcTitle, message: rcMessage } : errorMap['default']);

    return (
        <PaymentStatusLayout maxWidth="max-w-2xl">
            <PaymentStatusHeader
                icon={ShieldClose}
                title={title}
                subtitle="Critical system exception"
                variant="error"
            />

            <div className="p-8 md:p-12 space-y-10">
                <div className="text-center space-y-4">
                    <p className="text-gray-600 font-medium leading-relaxed max-w-sm mx-auto italic">
                        "{message}"
                    </p>
                </div>

                <PaymentAdvice
                    variant="error"
                    contextIcon={HelpCircle}
                    contextTitle="Immediate Assistance"
                    contextText="If you believe this is an error or if funds have been deducted from your account, please contact our support team immediately with your booking details."
                    adviceItems={[
                        {
                            icon: Mail,
                            label: 'Email Support',
                            text: 'ride@lessssgopng.com'
                        }
                    ]}
                />

                <PaymentActions
                    actions={[
                        {
                            label: 'Return Home',
                            onClick: () => window.location.href = '/',
                            variant: 'primary',
                            colorClass: 'bg-gray-900',
                            icon: Home
                        },
                        {
                            label: 'Contact Us',
                            onClick: () => window.location.href = '/contact',
                            variant: 'secondary'
                        }
                    ]}
                />
            </div>
        </PaymentStatusLayout>
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
