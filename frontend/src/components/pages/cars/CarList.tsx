'use client';

import Link from 'next/link';
import { Car } from 'lucide-react';

interface CarType {
  id: number;
  name: string;
  image: string;
  pricePerDay: number;
}

const cars: CarType[] = [
  { id: 1, name: 'Tesla Model X', image: '/images/tesla1.jpg', pricePerDay: 200 },
  { id: 2, name: 'BMW i8', image: '/images/bmw1.jpg', pricePerDay: 180 },
  { id: 3, name: 'Audi R8', image: '/images/audi1.jpg', pricePerDay: 220 },
];

export default function CarsList() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div key={car.id} className="bg-card shadow-sm border border-border rounded-2xl overflow-hidden transition-all hover:shadow-md">
          <img src={car.image} alt={car.name} className="w-full h-48 object-cover" />
          <div className="p-5 flex flex-col gap-3">
            <h3 className="text-lg font-extrabold text-[#020617] uppercase tracking-tight">{car.name}</h3>
            <p className="text-muted-foreground font-semibold">K{car.pricePerDay} / day</p>
            <Link
              href={`/car?id=${car.id}`}
              className="mt-2 inline-block px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 text-center transition-all shadow-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
