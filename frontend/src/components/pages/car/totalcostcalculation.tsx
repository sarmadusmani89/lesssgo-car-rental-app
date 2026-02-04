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
    return days >= 0 ? days + 1 : 0; // Include both start and end day
  };

  const days = getDays();
  const total = pricePerDay * days;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</p>
          <p className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tighter">{days} {days === 1 ? 'Day' : 'Days'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Rate</p>
          <p className="text-xl font-black text-blue-600 font-outfit uppercase tracking-tighter">${pricePerDay} <span className="text-[10px] text-gray-400">/ d</span></p>
        </div>
      </div>

      <div className="pt-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mb-3">Total Investment</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-gray-900 font-outfit tracking-tighter">${total}</span>
              <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">USD</span>
            </div>
          </div>
          <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tax Included</span>
          </div>
        </div>
      </div>
    </div>
  );
}
