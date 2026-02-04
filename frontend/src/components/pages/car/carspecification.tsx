'use client';

import { Users, Gauge, Fuel, Cpu } from 'lucide-react';

interface Specs {
  seats: number;
  type: string;
  fuel: string;
  transmission: string;
}

interface Props {
  specs: Specs;
}

export default function VehicleSpecifications({ specs }: Props) {
  const specList = [
    { label: 'Seats', value: `${specs.seats} People`, icon: <Users size={20} /> },
    { label: 'Category', value: specs.type, icon: <Gauge size={20} /> },
    { label: 'Fuel', value: specs.fuel, icon: <Fuel size={20} /> },
    { label: 'Gearbox', value: specs.transmission, icon: <Cpu size={20} /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {specList.map((s, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-gray-50 flex flex-col items-center text-center group hover:bg-blue-600 transition-colors duration-300">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/20 group-hover:text-white transition-colors">
            {s.icon}
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/60">{s.label}</p>
          <p className="text-sm font-bold text-gray-900 group-hover:text-white mt-0.5">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
