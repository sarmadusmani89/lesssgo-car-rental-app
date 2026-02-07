'use client';

export default function BookingStatusTimeline({ booking }: { booking: any }) {
  if (!booking) return null;

  const steps = [
    { title: 'Booking Request', status: 'completed', date: new Date(booking.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) },
    {
      title: 'Status: ' + booking.status,
      status: booking.status === 'CANCELLED' ? 'cancelled' : (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? 'completed' : 'active'),
      date: new Date(booking.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    },
    { title: 'Payment: ' + booking.paymentStatus, status: booking.paymentStatus === 'PAID' ? 'completed' : 'active', date: new Date(booking.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) },
  ];

  if (booking.status === 'COMPLETED') {
    steps.push({ title: 'Trip Finished', status: 'completed', date: new Date(booking.endDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) });
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Booking Timeline</h2>
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${step.status === 'completed'
                ? 'bg-green-500'
                : step.status === 'cancelled'
                  ? 'bg-red-500'
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
