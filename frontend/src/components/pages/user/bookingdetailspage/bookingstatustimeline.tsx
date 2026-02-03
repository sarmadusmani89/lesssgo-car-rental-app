'use client';

export default function BookingStatusTimeline() {
  const steps = [
    { title: 'Booking Confirmed', status: 'completed', date: '2026-02-01' },
    { title: 'Payment Received', status: 'completed', date: '2026-02-01' },
    { title: 'Car Assigned', status: 'active', date: '2026-02-03' },
    { title: 'Trip Started', status: 'upcoming', date: '2026-02-05' },
    { title: 'Trip Completed', status: 'upcoming', date: '2026-02-06' },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Booking Status Timeline</h2>
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${step.status === 'completed'
                  ? 'bg-green-500'
                  : step.status === 'active'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}
            ></div>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-gray-500 text-sm">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
