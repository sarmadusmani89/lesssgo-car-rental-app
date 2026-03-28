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
    User,
    Heart
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { formatPrice, formatDashboardDate } from '@/lib/utils';
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Initialising your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dashboard <span className="text-primary">Overview</span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's a brief summary of your recent activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all duration-300">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Bookings</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{stats?.bookings || 0}</h3>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-all duration-300">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Saved Vehicles</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{wishlistItems.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300">
                        <Heart size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all duration-300">
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Spent</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{formatPrice(stats?.totalSpent || 0, currency)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300">
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Bookings</h2>
                        <Link href="/dashboard/bookings" className="group text-primary font-bold text-sm flex items-center gap-1">
                            <span className="group-hover:underline underline-offset-4 tracking-tight">View All</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        {recentBookings.length > 0 ? recentBookings.map((booking) => (
                            <div key={booking.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                                    <Image
                                        src={booking.car?.imageUrl || '/images/cars/placeholder.jpg'}
                                        alt={booking.car?.name || 'Car'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate">{booking.car?.brand} {booking.car?.name}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {formatDashboardDate(booking.startDate)}</span>
                                        <span className={`px-2 py-0.5 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="font-bold text-slate-900 text-sm">{formatPrice(booking.totalAmount, currency)}</div>
                                </div>
                            </div>
                        </div>
                        )) : (
                            <div className="p-10 text-center">
                                <p className="text-slate-400 font-medium">No recent bookings found.</p>
                                <Link href="/cars" className="text-primary font-bold mt-2 inline-block hover:underline">Rent your first car</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/cars" className="p-6 bg-slate-900 text-white rounded-3xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10">
                            <ArrowUpRight className="absolute top-4 right-4 text-white/30 group-hover:text-white transition-all duration-300" size={20} />
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-white/20">
                                <Car className="text-white" size={20} />
                            </div>
                            <h3 className="font-bold text-lg leading-tight tracking-tight">Book a <br /> New Vehicle</h3>
                        </Link>

                        <Link href="/dashboard/profile" className="p-6 bg-white border border-slate-100 rounded-3xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100">
                            <ArrowUpRight className="absolute top-4 right-4 text-slate-300 group-hover:text-primary transition-all duration-300" size={20} />
                            <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10">
                                <User className="text-primary" size={20} />
                            </div>
                            <h3 className="font-bold text-lg leading-tight tracking-tight text-slate-900">Manage My <br /> Account</h3>
                        </Link>
                    </div>

                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                Support Center
                            </h4>
                            <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">
                                Visit our dedicated <strong className="text-slate-700">Support Hub</strong> for FAQs and local concierge assistance in Port Moresby.
                            </p>
                            <Link href="/dashboard/support" className="text-primary text-[10px] font-bold uppercase tracking-widest mt-4 inline-block hover:underline underline-offset-4">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
