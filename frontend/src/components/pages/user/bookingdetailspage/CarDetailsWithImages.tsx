'use client';

import { formatPrice } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Image from 'next/image';

export default function CarDetailsWithImages({ car }: { car: any }) {
  const { currency, rates } = useSelector((state: RootState) => state.ui);
  if (!car) return null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className="mb-4">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Vehicle</label>
        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-tight">{car.brand} {car.name}</h2>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        {car.imageUrl && (
          <Image
            src={car.imageUrl}
            alt={car.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Gear</p>
            <p className="text-xs font-bold text-slate-700 uppercase mt-1">{car.transmission || 'Auto'}</p>
          </div>
          <div className="w-[1px] h-6 bg-slate-100" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tank</p>
            <p className="text-xs font-bold text-slate-700 uppercase mt-1">{car.fuelCapacity || '50'}L</p>
          </div>
        </div>
        <p className="text-base font-black text-primary tracking-tighter">
          {formatPrice(car.pricePerDay, currency, rates)}<span className="text-[10px] text-slate-400 font-bold tracking-normal ml-0.5">/d</span>
        </p>
      </div>
    </div>
  );
}
