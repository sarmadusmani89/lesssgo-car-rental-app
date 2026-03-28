'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSuccess from '@/components/pages/auth/AuthSuccess';

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
                <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-[1.25rem] text-sm font-semibold mb-6 flex items-center gap-3">
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
                    error={errors.email?.message}
                />

                <Button type="submit" variant="accent" size="lg" className="w-full mt-8" isLoading={loading}>
                    Send Reset Link
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Remember your password? <Link href="/auth/login" className="text-accent font-extrabold hover:underline">Back to Sign in</Link>
            </p>
        </>
    );
}
