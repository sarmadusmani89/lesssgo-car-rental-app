'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSuccess from '@/components/pages/auth/AuthSuccess';
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
            <AuthSuccess
                title="Check your email"
                message="Reset instructions sent."
                description={success}
                actionText="Return to Log in"
                actionHref="/auth/login"
            />
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
                    required
                    {...register('email', {
                        required: 'Email is required',
                        maxLength: { value: 100, message: 'Max 100 characters' },
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    maxLength={100}
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
