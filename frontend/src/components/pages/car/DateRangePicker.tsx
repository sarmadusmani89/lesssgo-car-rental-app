'use client';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: Props) {
  return (
    <div className="p-6 bg-white shadow-xl shadow-gray-100 rounded-3xl border border-gray-100 mb-6">
      <h2 className="font-bold text-xl text-gray-900 font-outfit mb-4">Select Rental Period</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Pickup Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange(e.target.value, endDate)}
            className="w-full border-2 border-gray-50 bg-gray-50 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white transition outline-none font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Return Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange(startDate, e.target.value)}
            className="w-full border-2 border-gray-50 bg-gray-50 px-4 py-3 rounded-2xl focus:border-blue-500 focus:bg-white transition outline-none font-medium"
          />
        </div>
      </div>
    </div>
  );
}
