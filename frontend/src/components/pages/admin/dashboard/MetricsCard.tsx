'use client';

import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function MetricsCards({ stats }: { stats: any }) {
    const data = [
        {
            title: "Total Bookings",
            value: stats?.bookings || 0,
            icon: Calendar,
        },
        {
            title: "Total Revenue",
            value: `K${stats?.revenue?.toLocaleString() || 0}`,
            icon: DollarSign,
        },
        {
            title: "Total Users",
            value: stats?.users || 0,
            icon: Users,
        },
        {
            title: "Available Cars",
            value: stats?.availableCars || 0,
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item) => (
                <div
                    key={item.title}
                    className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 transition-all hover:border-primary/20"
                >
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                        <item.icon size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">{item.title}</p>
                        <p className="text-xl font-extrabold text-slate-900 tracking-tight">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
