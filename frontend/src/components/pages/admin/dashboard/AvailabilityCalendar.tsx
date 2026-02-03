export default function AvailabilityCalendar() {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const bookedDays = [5, 12, 18, 22];

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">Availability</h2>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                    <div
                        key={day}
                        className={`text-center p-2 rounded text-sm ${bookedDays.includes(day)
                            ? "bg-red-200"
                            : "bg-green-200"
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}
