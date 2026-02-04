'use client';

interface Props {
  pricePerDay: number;
}

export default function PricingDisplay({ pricePerDay }: Props) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Pricing</h2>
      <p className="text-gray-700">${pricePerDay} / day</p>
    </div>
  );
}
