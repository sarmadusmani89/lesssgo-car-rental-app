'use client';

import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function MetricsCards({ stats }: { stats: any }) {
    const data = [
        {
            title: "Total Bookings",
            value: stats?.bookings || 0,
            icon: Calendar,
            color: "text-slate-600",
        },
        {
            title: "Total Revenue",
            value: `K${stats?.revenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: "text-slate-600",
        },
        {
            title: "Total Users",
            value: stats?.users || 0,
            icon: Users,
            color: "text-slate-600",
        },
        {
            title: "Available Cars",
            value: stats?.availableCars || 0,
            icon: TrendingUp,
            color: "text-slate-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item) => (
                <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4 transition-all hover:border-primary/20"
                >
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                        <item.icon size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">{item.title}</p>
                        <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
