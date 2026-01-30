'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import styles from '../auth.module.css';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (token) {
            api.get(`/auth/verify?token=${token}`)
                .then((res: any) => {
                    setStatus('success');
                    setMessage(res.message || 'Email verified successfully');
                })
                .catch((err: any) => {
                    setStatus('error');
                    setMessage(err.response?.data?.message || 'Verification failed');
                });
        } else {
            setStatus('error');
            setMessage('No verification token found.');
        }
    }, [token]);

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.statusContent}>
                    {status === 'loading' && (
                        <>
                            <Loader2 className={`${styles.statusIcon} ${styles.spin}`} size={64} />
                            <h2>Verifying...</h2>
                            <p>Please wait while we verify your email address.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className={`${styles.statusIcon} ${styles.successIcon}`} size={64} />
                            <h2>Email Verified!</h2>
                            <p>{message}</p>
                            <Link href="/login" className="btn btn-primary" style={{ marginTop: '2rem' }}>Sign In Now</Link>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className={`${styles.statusIcon} ${styles.errorIcon}`} size={64} />
                            <h2>Verification Failed</h2>
                            <p>{message}</p>
                            <Link href="/signup" className="btn btn-outline" style={{ marginTop: '2rem' }}>Try Signing Up Again</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className={styles.authPage}>
                <div className={styles.authCard}>
                    <div className={styles.statusContent}>
                        <Loader2 className={`${styles.statusIcon} ${styles.spin}`} size={64} />
                        <h2>Loading...</h2>
                    </div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
