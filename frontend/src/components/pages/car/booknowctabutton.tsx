'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface Props {
  carId: string;
  startDate: string;
  endDate: string;
  disabled?: boolean;
}

export default function BookNowCTAButton({ carId, startDate, endDate, disabled }: Props) {
  const router = useRouter();

  const handleBooking = () => {
    if (!startDate || !endDate) return;
    router.push(`/checkoutpage?id=${carId}&startDate=${startDate}&endDate=${endDate}`);
  };

  return (
    <button
      onClick={handleBooking}
      disabled={disabled}
      className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300 shadow-lg ${disabled
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-blue-100'
        }`}
    >
      Reserve this Vehicle
      <ArrowRight size={22} />
    </button>
  );
}
