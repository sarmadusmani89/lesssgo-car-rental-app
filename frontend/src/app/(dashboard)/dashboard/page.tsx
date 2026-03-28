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
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Dashboard <span className="text-primary  ">Overview</span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium  ">Welcome back! Here's a summary of your activities.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all duration-300">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Bookings</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stats?.bookings || 0}</h3>
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                        <Calendar size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-rose-200 transition-all duration-300">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Saved Vehicles</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{wishlistItems.length}</h3>
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300">
                        <Heart size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all duration-300">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Total Spent</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{formatPrice(stats?.totalSpent || 0, currency)}</h3>
                    </div>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-300">
                        <Wallet size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
                        <Link href="/dashboard/bookings" className="group text-primary font-bold text-sm flex items-center gap-1">
                            <span className="group-hover:underline underline-offset-4 tracking-tight">View All</span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
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
                                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{booking.car?.brand} {booking.car?.name}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-slate-500  ">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {formatDashboardDate(booking.startDate)}</span>
                                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-slate-900 text-sm">{formatPrice(booking.totalAmount, currency)}</div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center">
                                <p className="text-slate-400 font-medium tracking-tight">No recent bookings found.</p>
                                <Link href="/cars" className="text-primary font-bold mt-2 inline-block hover:underline underline-offset-4  ">Rent your first car</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/cars" className="p-6 bg-primary text-white rounded-3xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                            <ArrowUpRight className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-all duration-300" size={24} />
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-white/20">
                                <Car className="text-white" size={24} />
                            </div>
                            <h3 className="font-black text-lg leading-tight tracking-tight  ">Book New <br /> Vehicle</h3>
                        </Link>

                        <Link href="/dashboard/profile" className="p-6 bg-slate-900 text-white rounded-3xl group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/20">
                            <ArrowUpRight className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-all duration-300" size={24} />
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-white/20">
                                <User className="text-white" size={24} />
                            </div>
                            <h3 className="font-black text-lg leading-tight tracking-tight  ">Update My <br /> Profile</h3>
                        </Link>
                    </div>

                    <div className="bg-primary/[0.03] p-6 rounded-3xl border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Need help?
                        </h4>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium    ">
                            Check our <strong className="text-slate-900">Support Hub</strong> for FAQs or contact our dedicated VIP concierge service for active rentals.
                        </p>
                        <Link href="/dashboard/support" className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mt-4 inline-block hover:underline underline-offset-4">
                            Support Center
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
