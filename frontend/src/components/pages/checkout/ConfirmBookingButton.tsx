'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

  const label = paymentMethod === 'ONLINE'
    ? `Pay Online (Stripe) — ${formatPrice(grandTotal, currency, rates)}`
    : `Confirm Reservation (Cash on Collection)`;

  return (
    <Button
      disabled={disabled}
      onClick={onConfirm}
      variant="primary"
      size="lg"
      className="w-full py-8 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
    >
      <ShieldCheck size={18} />
      {label}
    </Button>
  );
}
