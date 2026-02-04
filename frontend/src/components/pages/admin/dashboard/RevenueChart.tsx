export default function RevenueChart({ stats }: { stats: any }) {
    // Generate some dummy data based on total revenue for visualization
    const revenue = [
        (stats?.revenue || 0) * 0.1,
        (stats?.revenue || 0) * 0.15,
        (stats?.revenue || 0) * 0.12,
        (stats?.revenue || 0) * 0.2,
        (stats?.revenue || 0) * 0.18,
        (stats?.revenue || 0) * 0.25,
    ];

    const maxVal = Math.max(...revenue, 1);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 font-outfit">Monthly Revenue Distribution</h2>

            <div className="flex items-end justify-between gap-3 h-48 px-2">
                {revenue.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 group-hover:bg-blue-600 relative overflow-hidden"
                            style={{ height: `${(value / maxVal) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">Month {index + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
