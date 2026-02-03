'use client';

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

export default function PaymentMethodSelection({
  selected,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-3">
      <h2 className="text-lg font-semibold">Payment Method</h2>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          checked={selected === 'card'}
          onChange={() => onChange('card')}
        />
        Credit / Debit Card (Stripe)
      </label>

      <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
        <input type="radio" disabled />
        Cash on Delivery (Coming soon)
      </label>
    </div>
  );
}
