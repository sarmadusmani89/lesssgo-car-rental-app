export default function RevenueChart() {
    const revenue = [4000, 6000, 5000, 8000, 7000, 9000];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Monthly Revenue</h2>

            <div className="flex items-end gap-2 h-40">
                {revenue.map((value, index) => (
                    <div
                        key={index}
                        className="bg-blue-500 w-full rounded"
                        style={{ height: `${value / 100}px` }}
                    />
                ))}
            </div>
        </div>
    );
}
