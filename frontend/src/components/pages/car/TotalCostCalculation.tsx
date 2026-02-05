'use client';

interface Props {
  pricePerDay: number;
  startDate: string | Date;
  endDate: string | Date;
}

export default function TotalCostCalculation({ pricePerDay, startDate, endDate }: Props) {
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in milliseconds
    const diff = end.getTime() - start.getTime();

    // If dates are invalid or end is before start
    if (isNaN(diff) || diff <= 0) return 0;

    // Calculate 24-hour periods
    // We use Math.ceil to round up any partial day to a full day
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    // Minimum 1 day
    return Math.max(1, days);
  };

  const days = calculateDays();
  const total = days * pricePerDay;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-xl font-black text-gray-900 font-outfit tracking-tight uppercase italic border-b border-gray-100 pb-4">Rental Calculus</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-bold uppercase tracking-widest">Base Rate</span>
          <span className="text-gray-900 font-black">${pricePerDay} <span className="text-[10px] opacity-40">/ DAY</span></span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-bold uppercase tracking-widest">Rental Duration</span>
          <span className="text-blue-600 font-black">{days} {days === 1 ? 'Day' : 'Days'}</span>
        </div>

        <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Gross Total</p>
            <p className="text-3xl font-black text-gray-900 font-outfit tracking-tighter">${total}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">Tax Included</span>
          </div>
        </div>
      </div>
    </div>
  );
}
