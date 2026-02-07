import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function MetricsCards({ stats }: { stats: any }) {
    const data = [
        {
            title: "Total Bookings",
            value: stats?.bookings || 0,
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Total Revenue",
            value: `A$${stats?.revenue?.toLocaleString() || 0} `,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "Total Users",
            value: stats?.users || 0,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Available Cars",
            value: stats?.availableCars || 0,
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item) => (
                <div
                    key={item.title}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4"
                >
                    <div className={`p - 3 rounded - lg ${item.bg} ${item.color} `}>
                        <item.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{item.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
