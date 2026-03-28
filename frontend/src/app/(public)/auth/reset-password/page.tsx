'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Lock, Loader2, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import AuthSuccess from '@/components/pages/auth/AuthSuccess';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

type ResetFormInputs = {
    password: string;
    confirmPassword: string;
};

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [verifying, setVerifying] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetFormInputs>();

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing reset token.');
            router.push('/auth/login');
            return;
        }

        const verifyToken = async () => {
            try {
                await authApi.verifyResetToken(token);
                setTokenValid(true);
            } catch (error) {
                toast.error('Invalid or expired reset token.');
                router.push('/auth/login');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token, router]);

    const onSubmit: SubmitHandler<ResetFormInputs> = async (data) => {
        if (!token) return;

        setLoading(true);
        setSuccess('');

        try {
            const res = await authApi.resetPassword({ token, password: data.password });
            setSuccess(res.message || 'Password reset successful');
            toast.success('Password has been reset successfully!');
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Password reset failed.');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="animate-spin text-accent mb-6" size={48} />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Verifying security link...</p>
            </div>
        );
    }

    if (!tokenValid) return null; // Should have redirected


    if (success) {
        return (
            <AuthSuccess
                title="Password Reset!"
                message="Your password has been reset successfully."
                description="You can now log in with your new secure password and access our premium fleet."
                actionText="Return to Log in"
                actionHref="/auth/login"
            />
        );
    }

    return (
        <>
            <h2 className="text-4xl lg:text-5xl font-black mb-2 tracking-tighter text-slate-900 font-outfit uppercase  ">Set New Password</h2>
            <p className="text-muted-foreground mb-10 text-[15px]">Enter your new secure password below.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <AuthInput
                    label="New Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    required
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min length is 6' },
                        maxLength: { value: 50, message: 'Max 50 characters' }
                    })}
                    maxLength={50}
                    error={errors.password?.message}
                />

                <AuthInput
                    label="Confirm Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    required
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        maxLength: { value: 50, message: 'Max 50 characters' },
                        validate: (val: string) => {
                            if (watch('password') !== val) {
                                return "Passwords do not match";
                            }
                        },
                    })}
                    maxLength={50}
                    error={errors.confirmPassword?.message}
                />

                <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full mt-8"
                    isLoading={loading}
                >
                    Reset Password
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Remember your password? <Link href="/auth/login" className="text-accent font-extrabold hover:underline">Back to Sign in</Link>
            </p>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Security"
            heading={<>Secure your <br /> <span className="gradient-text">Account.</span></>}
            subheading="Manage your access with industry-standard security."
        >
            <Suspense fallback={
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-accent" size={40} />
                </div>
            }>
                <ResetPasswordContent />
            </Suspense>
        </AuthSplitLayout>
    );
}
