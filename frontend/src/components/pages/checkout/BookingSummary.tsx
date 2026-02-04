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
    return days >= 0 ? days + 1 : 0; // Include both start and end day (Sync with CheckoutPage)
  };

  const days = getDays();
  const total = car ? car.pricePerDay * days : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '...';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 space-y-8">
      <h2 className="text-xl font-black font-outfit text-gray-900 border-b pb-6 border-gray-100 uppercase tracking-tight">Booking Summary</h2>

      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Vehicle Selection</span>
          <p className="font-black text-gray-900 tracking-tight uppercase text-lg">
            {car ? car.name : '...'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Rental Period</span>
          <p className="font-bold text-gray-900 text-sm">
            From {formatDate(startDate)} To {formatDate(endDate)}
          </p>
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
