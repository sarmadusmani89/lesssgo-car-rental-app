'use client';

import { formatPrice } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Image from 'next/image';

export default function CarDetailsWithImages({ car }: { car: any }) {
  const { currency, rates } = useSelector((state: RootState) => state.ui);
  if (!car) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col">
      <div className="mb-4">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Selected Vehicle</label>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{car.brand} {car.name}</h2>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-4">
        {car.imageUrl && (
          <Image
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gear</span>
            <span className="text-xs font-semibold text-slate-700 uppercase leading-none mt-1">{car.transmission || 'Auto'}</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuel</span>
            <span className="text-xs font-semibold text-slate-700 uppercase leading-none mt-1">{car.fuelCapacity || '50'}L</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-primary tracking-tight">
            {formatPrice(car.pricePerDay, currency, rates)}
            <span className="text-[10px] text-slate-400 font-bold ml-0.5 tracking-normal uppercase">/ Day</span>
          </p>
        </div>
      </div>
    </div>
  );
}
