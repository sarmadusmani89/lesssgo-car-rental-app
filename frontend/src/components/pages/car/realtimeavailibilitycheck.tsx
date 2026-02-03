'use client';

import { useState } from 'react';

interface Props {
  vehicleId: string;
}

export default function RealTimeAvailabilityCheck({ vehicleId }: Props) {
  const [available, setAvailable] = useState<boolean | null>(null);

  const checkAvailability = () => {
    // Dummy check, replace with API call
    const isAvailable = Math.random() > 0.3;
    setAvailable(isAvailable);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg flex flex-col gap-2">
      <h2 className="font-semibold text-lg">Availability</h2>
      <button
        onClick={checkAvailability}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-max"
      >
        Check Availability
      </button>
      {available !== null && (
        <p className={`mt-2 font-medium ${available ? 'text-green-600' : 'text-red-600'}`}>
          {available ? 'Available' : 'Not Available'}
        </p>
      )}
    </div>
  );
}
