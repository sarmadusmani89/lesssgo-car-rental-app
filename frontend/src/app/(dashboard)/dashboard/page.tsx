'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Car, Calendar, User, Settings } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            router.push('/auth/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="container section-padding">
            <div className="animate-slide-up">
                <h1 className="font-outfit" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p style={{ color: 'var(--muted-foreground)', marginBottom: '3rem', fontSize: '1.25rem' }}>
                    Manage your premium rentals and profile settings from your personalized dashboard.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <DashboardCard
                        title="My Bookings"
                        icon={Calendar}
                        href="/dashboard/bookings"
                        description="View and manage your current and past car reservations."
                    />
                    <DashboardCard
                        title="Explore Fleet"
                        icon={Car}
                        href="/vehicles"
                        description="Browse our exclusive collection of high-performance vehicles."
                    />
                    <DashboardCard
                        title="Profile Settings"
                        icon={User}
                        href="/dashboard/profile"
                        description="Update your personal information and security preferences."
                    />
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, icon: Icon, href, description }: any) {
    return (
        <Link href={href} className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius)', display: 'block', transition: 'all 0.3s ease' }}>
            <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(37, 99, 235, 0.1)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: 'var(--accent)'
            }}>
                <Icon size={30} />
            </div>
            <h3 className="font-outfit" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{title}</h3>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', lineHeight: '1.5' }}>{description}</p>
        </Link>
    );
}
