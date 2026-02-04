'use client';

import { ShieldCheck } from 'lucide-react';

interface Props {
  disabled: boolean;
  onConfirm: () => void;
  paymentMethod?: string;
  total?: number;
}

export default function ConfirmBookingButton({
  disabled,
  onConfirm,
  paymentMethod,
  total,
}: Props) {
  const label = paymentMethod === 'stripe'
    ? `Pay Via Stripe ($${total || 0})`
    : 'Confirm Reservation';

  return (
    <button
      disabled={disabled}
      onClick={onConfirm}
      className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${disabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-blue-100'
        }`}
    >
      <ShieldCheck size={18} />
      {label}
    </button>
  );
}
