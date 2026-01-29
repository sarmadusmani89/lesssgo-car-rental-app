'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import styles from '../auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Lock, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AuthInput from '@/components/auth/AuthInput';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';

type ResetFormInputs = {
    email: string;
    password: string;
};

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<ResetFormInputs>();

    const onSubmit: SubmitHandler<ResetFormInputs> = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (token) {
                // Reset Password Mode
                const res = await api.post('/auth/reset-password', { token, password: data.password });
                setSuccess(res.message || 'Password reset successful');
                setTimeout(() => router.push('/auth/login'), 3000);
            } else {
                // Forgot Password Mode
                const res = await api.post('/auth/forgot-password', { email: data.email });
                setSuccess(res.message);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || (token ? 'Reset failed' : 'Something went wrong. Please try again.');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Security"
            heading={<>Secure your <br /> <span className="gradient-text">Account.</span></>}
            subheading="Manage your access with industry-standard security."
        >
            <h2>{token ? 'Set New Password' : 'Reset Password'}</h2>
            <p>{token ? 'Enter your new secure password below' : 'Enter your email to receive a reset link'}</p>

            {error && (
                <div className={styles.error}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div className={styles.success}>
                    <CheckCircle2 size={18} />
                    {success}
                </div>
            )}

            {!success && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!token ? (
                        <>
                            <AuthInput
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="name@example.com"
                                {...register('email', {
                                    required: !token ? 'Email is required' : false,
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                })}
                                wrapperClassName={errors.email ? styles.inputError : ''}
                            />
                            {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                        </>
                    ) : (
                        <>
                            <AuthInput
                                label="New Password"
                                icon={Lock}
                                type="password"
                                placeholder="••••••••"
                                {...register('password', {
                                    required: !!token ? 'Password is required' : false,
                                    minLength: { value: 6, message: 'Min length is 6' }
                                })}
                                wrapperClassName={errors.password ? styles.inputError : ''}
                            />
                            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                        </>
                    )}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <Loader2 className={styles.spin} /> : (token ? 'Reset Password' : 'Send Reset Link')}
                    </button>
                </form>
            )}

            <p className={styles.footerText}>
                Remember your password? <Link href="/auth/login">Back to Sign in</Link>
            </p>
        </AuthSplitLayout>
    );
}
