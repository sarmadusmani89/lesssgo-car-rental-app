'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from '../auth.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Mail, Lock, User, Phone, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthSuccess from '@/components/pages/auth/AuthSuccess';
import AuthInput from '@/components/pages/auth/AuthInput';
import AuthSplitLayout from '@/components/pages/auth/AuthSplitLayout';
import { formatPNGPhone, mapToPNGPrefix } from '@/lib/utils';

// Define the form inputs
type SignupFormInputs = {
    name: string;
    email: string;
    phoneNumber: string;
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

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupFormInputs>();

    const phoneValue = watch('phoneNumber');

    const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Map phone to PNG format before sending
            const formattedData = {
                ...data,
                phoneNumber: mapToPNGPrefix(data.phoneNumber)
            };
            const res = await api.post<BackendResponse>('/auth/signup', formattedData);

            // Show success toast instead of inline? Or both. User asked for error toast.
            // Let's stick to inline success for now as it redirects.
            setSuccess(res.data.message);
            toast.success('Account created successfully!');

            // Redirect to login after 5 seconds if they don't click
            setTimeout(() => {
                if (window.location.pathname.includes('/auth/signup')) {
                    router.push('/auth/login');
                }
            }, 6000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Signup failed';

            // specific check for conflict or "User already exist" message
            if (err.response?.status === 409 || errorMessage.toLowerCase().includes('already exist')) {
                toast.error('This email is already registered. Please sign in instead.');
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
            {success ? (
                <AuthSuccess
                    title="Success!"
                    message="Your account has been created successfully."
                    description="Please check your inbox for a verification link to activate your premium access."
                    actionText="Continue to Sign In"
                    actionHref="/auth/login"
                    showAutoRedirect={true}
                />
            ) : (
                <>
                    <h2>Create Account</h2>
                    <p>Sign up to get started.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AuthInput
                            label="Full Name"
                            icon={User}
                            type="text"
                            placeholder="John Doe"
                            required
                            {...register('name', {
                                required: 'Name is required',
                                maxLength: { value: 50, message: 'Name cannot exceed 50 characters' }
                            })}
                            error={errors.name?.message}
                        />

                        <AuthInput
                            label="Email"
                            icon={Mail}
                            type="email"
                            placeholder="your@email.com"
                            required
                            {...register('email', {
                                required: 'Email is required',
                                maxLength: { value: 100, message: 'Email cannot exceed 100 characters' },
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                            })}
                            error={errors.email?.message}
                        />

                        <AuthInput
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            placeholder="7XXX XXXX"
                            prefix="+675"
                            required
                            {...register('phoneNumber', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^\d{4}\s?\d{4}$|^\d{8}$/,
                                    message: 'Phone must be 8 digits'
                                },
                                onChange: (e) => {
                                    const formatted = formatPNGPhone(e.target.value);
                                    if (formatted.replace(/\s/g, '').length <= 8) {
                                        setValue('phoneNumber', formatted);
                                    }
                                }
                            })}
                            error={errors.phoneNumber?.message}
                            maxLength={9}
                        />

                        <AuthInput
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            required
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Min length is 6' },
                                maxLength: { value: 50, message: 'Password cannot exceed 50 characters' }
                            })}
                            error={errors.password?.message}
                        />


                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? <Loader2 className={styles.spin} /> : 'Create Account'}
                        </button>
                    </form>
                </>
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
