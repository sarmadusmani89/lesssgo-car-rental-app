'use client';

import { useState, useEffect } from 'react';
import api from "@/lib/api";
import { Loader2 } from 'lucide-react';
import MetricsCards from "@/components/pages/admin/dashboard/MetricsCard";
import RevenueChart from "@/components/pages/admin/dashboard/RevenueChart";
import RecentBookingsTable from "@/components/pages/admin/dashboard/BookingsTable";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('6m');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/dashboard/admin?range=${range}`);
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-slate-400 font-medium text-xs mt-4">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard <span className="text-primary">Overview</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Monitor revenue trends, track metrics, and manage recent booking activities.
          </p>
        </div>
      </div>

      <MetricsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart stats={stats} range={range} onRangeChange={setRange} />
        <RecentBookingsTable bookings={stats.recentBookings} />
      </div>
    </div>
  );
}
