'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api'; // Using named import as per recent changes/context check
import styles from '@/app/(public)/auth/auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Lock, Loader2, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';
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
            <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                <p>Verifying link...</p>
            </div>
        );
    }

    if (!tokenValid) return null; // Should have redirected

    if (success) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-4 text-green-500">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Password Reset!</h3>
                <p className="text-gray-600 mb-6">
                    You can now log in with your new password.
                </p>
                <Link href="/auth/login" className="btn btn-primary btn-lg w-full">
                    Return to Log in
                </Link>
            </div>
        );
    }

    return (
        <>
            <h2>Set New Password</h2>
            <p className="mb-6">Enter your new secure password below.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <AuthInput
                    label="New Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Min length is 6' }
                    })}
                    wrapperClassName={errors.password ? styles.inputError : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}

                <AuthInput
                    label="Confirm Password"
                    icon={Lock}
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val: string) => {
                            if (watch('password') !== val) {
                                return "Passwords do not match";
                            }
                        },
                    })}
                    wrapperClassName={errors.confirmPassword ? styles.inputError : ''}
                />

                {errors.confirmPassword && (
                    <div className={`${styles.error} animate-in fade-in slide-in-from-top-2 duration-300 mt-2`}>
                        <AlertCircle size={18} />
                        <span>{errors.confirmPassword.message}</span>
                    </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                    {loading ? <Loader2 className={styles.spin} /> : 'Reset Password'}
                </button>
            </form>

            <p className={styles.footerText}>
                Remember your password? <Link href="/auth/login">Back to Sign in</Link>
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
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            }>
                <ResetPasswordContent />
            </Suspense>
        </AuthSplitLayout>
    );
}
