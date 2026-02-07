'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface Props {
  car: {
    name: string;
    brand: string;
    pricePerDay: number;
    hp?: number;
    passengers?: number;
    fuelType?: string;
    transmission?: string;
    airConditioner?: boolean;
    gps?: boolean;
    freeCancellation?: boolean;
    vehicleClass?: string;
  } | null;
  startDate: string;
  endDate: string;
  pickupLocation?: string;
  returnLocation?: string;
}

export default function BookingSummary({ car, startDate, endDate, pickupLocation, returnLocation }: Props) {
  const { currency, rates } = useSelector((state: RootState) => state.ui);

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize to midnight to calculate calendar days only
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? days + 1 : 0;
  };

  const days = getDays();
  const total = car ? car.pricePerDay * days : 0;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '...';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 space-y-8">
      <h2 className="text-xl font-black font-outfit text-gray-900 border-b pb-6 border-gray-100 uppercase tracking-tight">Booking Summary</h2>

      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Vehicle Selection</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight mb-1">
              {car?.brand || 'Premium'}
            </span>
            <div className="flex items-center gap-2">
              <p className="font-black text-slate-900 tracking-tight uppercase text-xl leading-tight">
                {car?.name || 'Selection'}
              </p>
              {car?.vehicleClass && (
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-widest">
                  {car.vehicleClass}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Rental Period</span>
          <p className="font-bold text-gray-900 text-sm">
            From {formatDate(startDate)} To {formatDate(endDate)}
          </p>
          {(pickupLocation || returnLocation) && (
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-50 pt-4">
              {pickupLocation && (
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Pickup</span>
                  <p className="font-bold text-gray-900 text-[10px] uppercase leading-tight">{pickupLocation}</p>
                </div>
              )}
              {returnLocation && (
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-1">Return</span>
                  <p className="font-bold text-gray-900 text-[10px] uppercase leading-tight">{returnLocation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</span>
          <span className="font-black text-gray-900 uppercase text-xs tracking-widest">{days} {days === 1 ? 'Day' : 'Days'}</span>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Vehicle Specifications</span>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</span>
              <span className="text-xs font-black text-slate-900 uppercase">{car?.hp || '0'} HP</span>
            </div>
            <div className="flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</span>
              <span className="text-xs font-black text-slate-900 uppercase">{car?.passengers || '4'} Seats</span>
            </div>
            <div className="flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Type</span>
              <span className="text-xs font-black text-slate-900 uppercase">{car?.fuelType || 'Petrol'}</span>
            </div>
            <div className="flex flex-col p-3 bg-slate-50/50 rounded-xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Drivetrain</span>
              <span className="text-xs font-black text-slate-900 uppercase">{car?.transmission || 'Automatic'}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Included Extras</span>
          <div className="flex flex-wrap gap-2">
            {car?.airConditioner && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">A/C</span>
            )}
            {car?.gps && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">GPS</span>
            )}
            {car?.freeCancellation && (
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-100">Free Cancel</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 mt-4 border-t border-gray-100 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">Total Investment</p>
          <p className="text-4xl font-black text-blue-600 font-outfit tracking-tighter">
            {formatPrice(total, currency, rates)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Tax Inclusive</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Proteccion Activada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
