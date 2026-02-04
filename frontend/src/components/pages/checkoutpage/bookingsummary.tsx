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
    return days > 0 ? days : 1; // Default to 1 day if same day
  };

  const days = getDays();
  const total = car ? car.pricePerDay * days : 0;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 space-y-8">
      <h2 className="text-xl font-black font-outfit text-gray-900 border-b pb-6 border-gray-100 uppercase tracking-tight">Booking Summary</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Vehicle Selection</span>
          <div className="text-right">
            <p className="font-black text-gray-900 tracking-tight">{car ? car.brand : '...'}</p>
            <p className="font-bold text-blue-600 tracking-tight -mt-1">{car ? car.name : '...'}</p>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Rental Period</span>
          <div className="text-right">
            <p className="font-bold text-gray-900 text-sm">
              {startDate ? new Date(startDate).toLocaleDateString() : '...'}
            </p>
            <p className="font-bold text-gray-900 text-sm">
              {endDate ? new Date(endDate).toLocaleDateString() : '...'}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</span>
          <span className="font-black text-gray-900 uppercase text-xs tracking-widest">{days} {days === 1 ? 'Day' : 'Days'}</span>
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">Total Investment</p>
          <p className="text-4xl font-black text-blue-600 font-outfit tracking-tighter">${total}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Tax Inclusive</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Proteccion Activada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
