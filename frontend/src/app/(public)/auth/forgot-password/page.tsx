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
            <h2 className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter text-slate-900 font-outfit uppercase  ">Forgot Password?</h2>
            <p className="text-muted-foreground mb-10 text-[15px]">No worries, we'll send you reset instructions.</p>

            <Suspense fallback={
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-accent" size={40} />
                </div>
            }>
                <ForgotPasswordForm />
            </Suspense>
        </AuthSplitLayout>
    );
}
