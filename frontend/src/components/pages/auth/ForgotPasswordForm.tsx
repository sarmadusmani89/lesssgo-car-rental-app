'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import AuthInput from '@/components/pages/auth/AuthInput';
import styles from '@/app/(public)/auth/auth.module.css';

type ForgotPasswordInputs = {
    email: string;
};

export default function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>();

    const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await authApi.forgotPassword(data.email);
            setSuccess(res.message || 'If an account exists with this email, you will receive a password reset link.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-4 text-green-500">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check your email</h3>
                <p className="text-gray-600 mb-6">
                    {success}
                </p>
                <Link href="/auth/login" className="btn btn-primary btn-lg w-full">
                    Return to Log in
                </Link>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className={styles.error}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <AuthInput
                    label="Email Address"
                    icon={Mail}
                    type="email"
                    placeholder="name@example.com"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    wrapperClassName={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                    {loading ? <Loader2 className={styles.spin} /> : 'Send Reset Link'}
                </button>
            </form>

            <p className={styles.footerText}>
                Remember your password? <Link href="/auth/login">Back to Sign in</Link>
            </p>
        </>
    );
}
