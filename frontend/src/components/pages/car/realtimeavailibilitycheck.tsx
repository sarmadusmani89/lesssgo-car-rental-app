'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Props {
  carId: string;
  startDate: string;
  endDate: string;
}

export default function RealTimeAvailabilityCheck({ carId, startDate, endDate }: Props) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (carId && startDate && endDate) {
      checkAvailability();
    } else {
      setAvailable(null);
    }
  }, [carId, startDate, endDate]);

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/car/${carId}/availability`, {
        params: { startDate, endDate }
      });
      setAvailable(res.data.available);
    } catch (error) {
      console.error("Availability check failed:", error);
      setAvailable(null);
    } finally {
      setLoading(false);
    }
  };

  if (!startDate || !endDate) return (
    <div className="p-6 bg-blue-50/50 text-blue-700 rounded-3xl text-sm font-black uppercase tracking-widest border border-blue-100/50 text-center leading-relaxed">
      Select dates to check <br /> vehicle availability.
    </div>
  );

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ${loading ? 'bg-gray-50 border-gray-100' :
      available === true ? 'bg-green-50 border-green-100 text-green-700 shadow-sm shadow-green-50' :
        available === false ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 border-gray-100'
      }`}>
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="animate-spin text-blue-600" size={24} />
        ) : available === true ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : available === false ? (
          <XCircle size={24} className="text-red-500" />
        ) : (
          <Loader2 className="animate-spin text-gray-400" size={24} />
        )}

        <div className="flex-1">
          <h4 className="font-bold text-sm uppercase tracking-wider">
            {loading ? 'Checking...' : available === true ? 'Available' : available === false ? 'Unavailable' : 'Status'}
          </h4>
          <p className="text-xs opacity-80 mt-0.5 font-medium">
            {loading ? 'Checking fleet status' :
              available === true ? 'This car is ready for your trip!' :
                available === false ? 'Already booked for these dates.' : 'Enter dates to verify.'}
          </p>
        </div>
      </div>
    </div>
  );
}
