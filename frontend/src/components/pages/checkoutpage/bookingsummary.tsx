'use client';

interface Props {
  car: { name: string; brand: string; pricePerDay: number } | null;
  startDate: string;
  endDate: string;
}

export default function BookingSummary({ car, startDate, endDate }: Props) {
  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = getDays();
  const total = car ? car.pricePerDay * days : 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 space-y-4 border border-gray-50">
      <h2 className="text-xl font-bold font-outfit text-gray-900 border-b pb-4 border-gray-100 mb-6">Booking Summary</h2>

      <div className="flex justify-between items-center text-gray-600">
        <span className="text-sm font-medium">Vehicle Selection</span>
        <span className="font-bold text-gray-900">{car ? `${car.brand} ${car.name}` : '...'}</span>
      </div>

      <div className="flex justify-between items-center text-gray-600">
        <span className="text-sm font-medium">Rental Period</span>
        <span className="font-bold text-gray-900 text-sm">
          {startDate ? new Date(startDate).toLocaleDateString() : '...'}
          <span className="mx-2 text-gray-300">→</span>
          {endDate ? new Date(endDate).toLocaleDateString() : '...'}
        </span>
      </div>

      <div className="flex justify-between items-center text-gray-600">
        <span className="text-sm font-medium">Total Duration</span>
        <span className="font-bold text-gray-900">{days} Days</span>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grand Total</p>
          <p className="text-3xl font-black text-blue-600 font-outfit">${total}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium">Tax included</p>
          <p className="text-xs text-green-500 font-bold">Insurance coverage included</p>
        </div>
      </div>
    </div>
  );
}
