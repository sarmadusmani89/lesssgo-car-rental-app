'use client';

import Link from 'next/link';
import { Car } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  image: string;
  pricePerDay: number;
}

const vehicles: Vehicle[] = [
  { id: 1, name: 'Tesla Model X', image: '/images/tesla1.jpg', pricePerDay: 200 },
  { id: 2, name: 'BMW i8', image: '/images/bmw1.jpg', pricePerDay: 180 },
  { id: 3, name: 'Audi R8', image: '/images/audi1.jpg', pricePerDay: 220 },
];

export default function VehiclesList() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white shadow rounded-lg overflow-hidden">
          <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover" />
          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{vehicle.name}</h3>
            <p className="text-gray-600">${vehicle.pricePerDay} / day</p>
            <Link
              href={`/vehicle?id=${vehicle.id}`}
              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
            >
              View Vehicle
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
