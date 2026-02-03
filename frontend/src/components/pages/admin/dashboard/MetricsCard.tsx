export default function MetricsCards() {
    const data = [
        { title: "Total Bookings", value: 128 },
        { title: "Revenue", value: "$24,500" },
        { title: "Active Rentals", value: 12 },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.map((item) => (
                <div
                    key={item.title}
                    className="bg-white rounded-lg shadow p-4"
                >
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <p className="text-2xl font-bold">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
