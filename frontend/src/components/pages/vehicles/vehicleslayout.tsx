'use client';

import { useState } from 'react';
import CarCard from '@/components/ui/CarCard';

interface Vehicle {
  id: number;
  name: string;
  image: string;
  pricePerDay: number;
  location: string;
  type: string;
}

const allVehicles: Vehicle[] = [
  { id: 1, name: 'Tesla Model X', image: '/images/tesla1.jpg', pricePerDay: 200, location: 'Karachi', type: 'SUV' },
  { id: 2, name: 'BMW i8', image: '/images/bmw1.jpg', pricePerDay: 180, location: 'Lahore', type: 'Coupe' },
  { id: 3, name: 'Audi R8', image: '/images/audi1.jpg', pricePerDay: 220, location: 'Islamabad', type: 'Coupe' },
  { id: 4, name: 'Mercedes GLE', image: '/images/mercedes1.jpg', pricePerDay: 210, location: 'Karachi', type: 'SUV' },
];

export default function VehiclesLayout() {
  const [search, setSearch] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredVehicles = allVehicles.filter((vehicle) => {
    return (
      vehicle.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterLocation ? vehicle.location === filterLocation : true) &&
      (filterType ? vehicle.type === filterType : true)
    );
  });

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Layout: Filters + Vehicles */}
      <div className="flex gap-6">
        {/* Filters */}
        <div className="w-64 bg-white p-4 shadow rounded-lg space-y-4">
          <h3 className="font-semibold text-lg mb-2">Filters</h3>

          {/* Location Filter */}
          <div>
            <label className="block mb-1 text-gray-700">Location</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">All</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block mb-1 text-gray-700">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">All</option>
              <option value="SUV">SUV</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <CarCard
                key={vehicle.id}
                id={vehicle.id}
                name={vehicle.name}
                image={vehicle.image}
                pricePerDay={vehicle.pricePerDay}
                location={vehicle.location}
                type={vehicle.type}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-full">No vehicles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
