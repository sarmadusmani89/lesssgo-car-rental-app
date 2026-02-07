"use client";

import { useEffect, useState } from 'react';
import {
    Car,
    Calendar,
    Clock,
    Wallet,
    ChevronRight,
    ArrowUpRight,
    Loader2,
    Heart
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function DashboardOverview() {
    const [stats, setStats] = useState<any>(null);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currency = useSelector((state: RootState) => state.ui.currency);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.id) {
                    const [statsRes, bookingsRes] = await Promise.all([
                        api.get(`/dashboard/user/${user.id}`),
                        api.get(`/booking/user/${user.id}`)
                    ]);
                    setStats(statsRes.data);
                    setRecentBookings(bookingsRes.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium font-outfit">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's a summary of your activities.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats?.bookings || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Saved Vehicles</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{wishlistItems.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                        <Heart size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{formatPrice(stats?.totalSpent || 0, currency)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 font-outfit">Recent Bookings</h2>
                        <Link href="/dashboard/bookings" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {recentBookings.length > 0 ? recentBookings.map((booking) => (
                            <div key={booking.id} className="p-4 hover:bg-gray-50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={booking.car?.imageUrl || '/images/cars/placeholder.jpg'}
                                            alt={booking.car?.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 text-sm">{booking.car?.brand} {booking.car?.name}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(booking.startDate).toLocaleDateString('en-AU', { timeZone: 'UTC' })}</span>
                                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900 text-sm">{formatPrice(booking.totalAmount, currency)}</div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">
                                <p>No recent bookings found.</p>
                                <Link href="/cars" className="text-blue-600 font-bold mt-2 inline-block">Rent your first car</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 font-outfit">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/cars" className="p-6 bg-blue-600 text-white rounded-3xl group relative overflow-hidden transition hover:-translate-y-1 shadow-lg shadow-blue-100">
                            <ArrowUpRight className="absolute top-4 right-4 text-white/50 group-hover:text-white transition" size={24} />
                            <Car className="text-white/30 mb-4" size={32} />
                            <h3 className="font-bold text-lg leading-tight">Book a New <br /> Vehicle</h3>
                        </Link>

                        <Link href="/dashboard/profile" className="p-6 bg-gray-900 text-white rounded-3xl group relative overflow-hidden transition hover:-translate-y-1 shadow-lg shadow-gray-200">
                            <ArrowUpRight className="absolute top-4 right-4 text-white/50 group-hover:text-white transition" size={24} />
                            <Clock className="text-white/30 mb-4" size={32} />
                            <h3 className="font-bold text-lg leading-tight">Update My <br /> Profile</h3>
                        </Link>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                            💡 Need help?
                        </h4>
                        <p className="text-indigo-700 text-sm mt-2 leading-relaxed">
                            Check our <strong>Support Hub</strong> for FAQs or contact our dedicated VIP concierge service for active rentals.
                        </p>
                        <Link href="/dashboard/support" className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-4 inline-block hover:underline">
                            Go to Support Center
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
