'use client';

import { Users, Gauge, Fuel, Cog, Zap } from 'lucide-react';

interface Specs {
  seats: number;
  type: string;
  fuel: string;
  transmission: string;
  hp: number;
}

interface Props {
  specs: Specs;
}

export default function VehicleSpecifications({ specs }: Props) {
  const specList = [
    { label: 'Seats', value: `${specs.seats} People`, icon: <Users size={20} /> },
    { label: 'Horsepower', value: `${specs.hp} HP`, icon: <Zap size={20} /> },
    { label: 'Fuel', value: specs.fuel, icon: <Fuel size={20} /> },
    { label: 'Gearbox', value: specs.transmission, icon: <Cog size={20} /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specList.map((s, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-600 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all duration-500 cursor-default"
        >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
            {s.icon}
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors duration-500">{s.label}</p>
          <p className="text-sm font-black text-gray-900 group-hover:text-white mt-1 transition-colors duration-500">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
