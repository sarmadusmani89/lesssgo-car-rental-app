'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, User, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';
import styles from '@/app/(public)/auth/auth.module.css';

interface SignupFormInputs {
    name: string;
    email: string;
    password: string;
}

interface BackendResponse {
    message: string;
    error?: string;
}

function SignupContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await api.post<BackendResponse>('/auth/signup', data);
            setSuccess(res.data.message);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Signup failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (

        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Join"
            heading={<>Join the <br /> <span className="gradient-text">Exclusive.</span></>}
            subheading="Enter the world of high-performance rentals and bespoke services."
        >
            <h2>Join Us</h2>
            <p>Create your Lesssgo profile today.</p>

            {error && (
                <div className={styles.error}>
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div className={styles.success}>
                    <Sparkles size={18} />
                    {success}
                </div>
            )}

            {!success && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AuthInput
                        label="Full Name"
                        icon={User}
                        type="text"
                        placeholder="John Doe"
                        {...register('name', { required: 'Name is required' })}
                        wrapperClassName={errors.name ? styles.inputError : ''}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}

                    <AuthInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="your@email.com"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                        })}
                        wrapperClassName={errors.email ? styles.inputError : ''}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}

                    <AuthInput
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min length is 6' } })}
                        wrapperClassName={errors.password ? styles.inputError : ''}
                    />
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}

                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <Loader2 className={styles.spin} /> : 'Create Account'}
                    </button>
                </form>
            )}

            <p className={styles.footerText}>
                Already a member? <Link href="/auth/login">Sign in</Link>
            </p>
        </AuthSplitLayout>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <SignupContent />
        </Suspense>
    );
}
