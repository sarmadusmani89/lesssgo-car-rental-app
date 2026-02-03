'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from '../auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';

// Define the form inputs
type SignupFormInputs = {
    name: string;
    email: string;
    password: string;
};

// Define the backend response interface
interface BackendResponse {
    message: string;
    user?: any;
    token?: string;
    [key: string]: any;
}

function SignupContent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormInputs>();

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await api.post<BackendResponse>('/auth/signup', data);

            // Show success toast instead of inline? Or both. User asked for error toast.
            // Let's stick to inline success for now as it redirects.
            setSuccess(res.data.message);
            toast.success('Account created successfully!');

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Signup failed';

            // specific check for conflict or "User already exist" message
            if (err.response?.status === 409 || errorMessage.toLowerCase().includes('already exist')) {
                toast.error(errorMessage);
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            imageSrc="/images/auth-side.png"
            imageAlt="Identity"
            heading={<>The Key to <br /> <span className="gradient-text">Excellence.</span></>}
            subheading="Join our premium fleet and experience the difference."
        >
            <h2>Create Account</h2>
            <p>Sign up to get started.</p>

            {!success && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AuthInput
                        label="Full Name"
                        icon={User}
                        type="text"
                        placeholder="John Doe"
                        {...register('name', {
                            required: 'Name is required',
                            maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
                        })}
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
                            maxLength: { value: 100, message: 'Email cannot exceed 100 characters' },
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
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Min length is 6' },
                            maxLength: { value: 50, message: 'Password cannot exceed 50 characters' }
                        })}
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
