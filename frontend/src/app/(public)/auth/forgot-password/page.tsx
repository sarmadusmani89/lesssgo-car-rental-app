'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';
import ForgotPasswordForm from '@/components/pages/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
    return (
        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Security"
            heading={<>Reset your <br /> <span className="gradient-text">Password.</span></>}
            subheading="Enter your email to receive instructions to reset your password."
        >
            <h2>Forgot Password?</h2>
            <p className="mb-6">No worries, we'll send you reset instructions.</p>

            <Suspense fallback={
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            }>
                <ForgotPasswordForm />
            </Suspense>
        </AuthSplitLayout>
    );
}
