'use client';

import { useState } from 'react';

interface Props {
  pricePerDay: number;
}

export default function TotalCostCalculation({ pricePerDay }: Props) {
  const [days, setDays] = useState(1);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Total Cost</h2>
      <div className="flex gap-2 items-center">
        <input
          type="number"
          min={1}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
        <span>day(s)</span>
      </div>
      <p className="mt-2 font-medium">${pricePerDay * days}</p>
    </div>
  );
}
