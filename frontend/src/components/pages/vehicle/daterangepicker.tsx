'use client';

import { useState } from 'react';

export default function DateRangePicker() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Select Date Range</h2>
      <div className="flex gap-2">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}
