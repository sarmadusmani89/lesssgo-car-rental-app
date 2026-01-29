'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import styles from '../auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';

type LoginFormInputs = {
    email: string;
    password: string;
    rememberMe: boolean;
};
import AuthInput from '@/components/auth/AuthInput';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';


export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const router = useRouter();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        // setError(''); // Removed local error state

        try {
            const res = await api.post('/auth/login', data);
            localStorage.setItem('token', res.access_token);
            router.push('/');
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
