'use client';

import { formatPrice } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Image from 'next/image';

export default function CarDetailsWithImages({ car }: { car: any }) {
  const { currency, rates } = useSelector((state: RootState) => state.ui);
  if (!car) return null;

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Booked Vehicle</label>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">{car.brand} {car.name}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Transmission</p>
              <p className="text-sm font-black text-slate-900 uppercase">{car.transmission || 'Automatic'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">Fuel Capacity</p>
              <p className="text-sm font-black text-slate-900 uppercase">{car.fuelCapacity ? `${car.fuelCapacity}L` : 'Standard'}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50">
            <p className="text-lg font-black text-primary tracking-tighter">
              {formatPrice(car.pricePerDay, currency, rates)} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">/ Day</span>
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
          {car.imageUrl && (
            <Image
              src={car.imageUrl}
              alt={car.name}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/20">
            {car.type || 'Premium'}
          </div>
        </div>
      </div>
    </div>
  );
}
