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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold font-outfit">Admin Dashboard</h1>

      <MetricsCards stats={stats} />

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart stats={stats} range={range} onRangeChange={setRange} />
      </div>

      <RecentBookingsTable bookings={stats.recentBookings} />
    </div>
  );
}
