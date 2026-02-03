'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import styles from '../auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type LoginFormInputs = {
    email: string;
    password: string;
    rememberMe: boolean;
};

interface LoginResponse {
    access_token: string;
    user: any;
}

import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const router = useRouter();
    const searchParams = useSearchParams();
    const verifyToken = searchParams.get('verifyToken');

    useEffect(() => {
        if (verifyToken) {
            const verifyEmail = async () => {
                try {
                    const res = await api.get(`/auth/verify?token=${verifyToken}`);
                    toast.success(res.data.message || 'Email verified successfully! You can now log in.');
                    // Replace URL to clean up the token after verification
                    router.replace('/auth/login');
                } catch (err: any) {
                    const errorMessage = err.response?.data?.message || 'Verification failed or link expired.';
                    toast.error(errorMessage);
                    // Replace URL even on failure to avoid re-triggering with an invalid token
                    router.replace('/auth/login');
                }
            };
            verifyEmail();
        }
    }, [verifyToken, router]);

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        // setError(''); // Removed local error state

        try {
            const res = await api.post<LoginResponse>('/auth/login', data);

            // Store token and user data in cookies (for Middleware)
            const expires = new Date(Date.now() + 86400000).toUTCString(); // 1 day
            document.cookie = `token=${res.data.access_token}; path=/; expires=${expires}; SameSite=Lax`;
            document.cookie = `role=${res.data.user.role}; path=/; expires=${expires}; SameSite=Lax`;

            // Store user data in localStorage for UI
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Role-based redirection
            if (res.data.user.role === 'admin') {
                router.push('/admin/bookings');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Identity"
            heading={<>The Key to <br /> <span className="gradient-text">Excellence.</span></>}
            subheading="Unlock your personalized experience and manage your premium fleet reservations."
        >
            <h2>Welcome</h2>
            <p>Sign in to your Lesssgo account.</p>

            {error && (
                <div className={styles.error}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <AuthInput
                    label="Email"
                    icon={Mail}
                    type="email"
                    placeholder="your@email.com"
                    {...register('email', { required: 'Email is required' })}
                    wrapperClassName={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

                <div className={styles.inputGroup}>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Password is required' })}
                        />
                    </div>
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                </div>

                <div className={styles.rememberRow}>
                    <label className={styles.rememberMe}>
                        <input type="checkbox" {...register('rememberMe')} />
                        <span>Remember me</span>
                    </label>
                    <Link href="/auth/forgot-password">Forgot Password?</Link>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                    {loading ? <Loader2 className={styles.spin} /> : 'Continue'}
                </button>
            </form>

            <p className={styles.footerText}>
                New here? <Link href="/auth/signup">Create account</Link>
            </p>
        </AuthSplitLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

