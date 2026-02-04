'use client';

interface Props {
  pricePerDay: number;
  startDate: string;
  endDate: string;
}

export default function TotalCostCalculation({ pricePerDay, startDate, endDate }: Props) {
  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const days = getDays();
  const total = pricePerDay * days;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-3xl shadow-xl shadow-gray-200">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-400 font-medium">Rental Duration</span>
        <span className="font-bold">{days} days</span>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <span className="text-xl font-bold font-outfit">Total Cost</span>
        <span className="text-3xl font-black font-outfit text-blue-400">${total}</span>
      </div>
    </div>
  );
}
