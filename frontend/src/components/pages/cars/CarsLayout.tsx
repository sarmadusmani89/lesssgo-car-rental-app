'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import CarsPageHeader from './CarsPageHeader';
import CarsFilters from './CarsFilters';
import CarsGrid from './CarsGrid';
import CarsPagination from './CarsPagination';

interface Car {
    id: string;
    brand: string;
    name: string;
    imageUrl: string;
    pricePerDay: number;
    type: string;
    transmission: string;
    fuelCapacity: number;
    status: string;
    pickupLocation?: string[];
    returnLocation?: string[];
}

export default function CarsLayout() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [allCars, setAllCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        type: searchParams.get('type') || '',
        transmission: searchParams.get('transmission') || '',
        pickup: searchParams.get('pickup') || '',
        return: searchParams.get('return') || '',
        vehicleClass: searchParams.get('vehicleClass') || '',
        fuelType: searchParams.get('fuelType') || ''
    });

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                // We fetch all available cars and filter on frontend for smoother experience
                // Or we could pass all params to backend if it supports them
                const res = await api.get('/car');
                setAllCars(res.data.filter((c: Car) => c.status === 'AVAILABLE'));
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    useEffect(() => {
        let results = [...allCars];

        // Search Query
        if (searchQuery) {
            results = results.filter(car =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                car.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filters
        if (filters.brand) {
            results = results.filter(car => car.brand.toLowerCase() === filters.brand.toLowerCase());
        }
        if (filters.type) {
            results = results.filter(car => car.type.toLowerCase() === filters.type.toLowerCase());
        }
        if (filters.transmission) {
            results = results.filter(car => car.transmission.toLowerCase() === filters.transmission.toLowerCase());
        }

        if (filters.vehicleClass) {
            results = results.filter(car => (car as any).vehicleClass?.toLowerCase() === filters.vehicleClass.toLowerCase());
        }
        if (filters.fuelType) {
            results = results.filter(car => (car as any).fuelType?.toLowerCase() === filters.fuelType.toLowerCase());
        }
        if (filters.pickup) {
            results = results.filter(car =>
                car.pickupLocation?.some(loc => loc.toLowerCase() === filters.pickup.toLowerCase())
            );
        }
        if (filters.return) {
            results = results.filter(car =>
                car.returnLocation?.some(loc => loc.toLowerCase() === filters.return.toLowerCase())
            );
        }

        setFilteredCars(results);
        setCurrentPage(1); // Reset to first page on filter change
    }, [allCars, searchQuery, filters]);

    const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
    const paginatedCars = filteredCars.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <CarsPageHeader
                    totalCars={filteredCars.length}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-3">
                        <CarsFilters
                            filters={filters}
                            onChange={setFilters}
                        />
                    </div>

                    {/* Results Grid */}
                    <div className="lg:col-span-9 space-y-12">
                        <CarsGrid
                            cars={paginatedCars}
                            loading={loading}
                        />

                        <CarsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
