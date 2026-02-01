export default function RecentBookingsTable() {
    const bookings = [
        { id: "B001", customer: "Ali", car: "Civic", status: "Active" },
        { id: "B002", customer: "Ahmed", car: "Corolla", status: "Completed" },
        { id: "B003", customer: "Sara", car: "City", status: "Pending" },
    ];

    return (
        <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-4">Recent Bookings</h2>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">ID</th>
                        <th className="text-left">Customer</th>
                        <th className="text-left">Car</th>
                        <th className="text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.id} className="border-b last:border-0">
                            <td className="py-2">{b.id}</td>
                            <td>{b.customer}</td>
                            <td>{b.car}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
