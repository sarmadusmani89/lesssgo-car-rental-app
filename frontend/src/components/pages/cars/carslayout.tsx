'use client';

import { useState } from 'react';
import CarCard from '@/components/ui/CarCard';

interface Car {
    id: number;
    brand: string;
    name: string;
    image: string;
    price: string;
    monthly: string;
    location: string;
    type: string;
    badge: string;
    badgeClass: string;
    hp: string;
    fuel: string;
    transmission: string;
}

const allCars: Car[] = [
    {
        id: 1,
        brand: 'TESLA',
        name: 'Model X',
        image: '/images/tesla1.jpg',
        price: '200',
        monthly: '5,000',
        location: 'Karachi',
        type: 'SUV',
        badge: 'Electric',
        badgeClass: '',
        hp: '670 HP',
        fuel: 'Electric',
        transmission: 'Auto'
    },
    {
        id: 2,
        brand: 'BMW',
        name: 'i8',
        image: '/images/bmw1.jpg',
        price: '180',
        monthly: '4,500',
        location: 'Lahore',
        type: 'Coupe',
        badge: 'Hybrid',
        badgeClass: '',
        hp: '369 HP',
        fuel: 'Hybrid',
        transmission: 'Auto'
    },
];

export default function CarsLayout() {
    const [search, setSearch] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [filterType, setFilterType] = useState('');

    const filteredCars = allCars.filter((car) => {
        return (
            car.name.toLowerCase().includes(search.toLowerCase()) &&
            (filterLocation ? car.location === filterLocation : true) &&
            (filterType ? car.type === filterType : true)
        );
    });

    return (
        <div className="p-8">
            {/* Search Bar */}
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search cars..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Layout: Filters + Cars */}
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

                {/* Cars Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <CarCard
                                key={car.id}
                                {...car}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600 col-span-full">No cars found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
