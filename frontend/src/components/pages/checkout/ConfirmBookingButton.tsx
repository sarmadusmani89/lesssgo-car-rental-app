'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface Props {
  disabled: boolean;
  onConfirm: () => void;
  paymentMethod?: string;
  total?: number;
  bondAmount?: number;
}

export default function ConfirmBookingButton({
  disabled,
  onConfirm,
  paymentMethod,
  total,
  bondAmount = 0,
}: Props) {
  const { currency, rates } = useSelector((state: RootState) => state.ui);

  const grandTotal = (total || 0) + bondAmount;

  const label = paymentMethod === 'stripe'
    ? `Pay Via Stripe (${formatPrice(grandTotal, currency, rates)})`
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
