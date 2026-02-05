import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface CarData {
    id: string;
    brand: string;
    name: string;
    type: string;
    transmission: string;
    fuelCapacity: number;
    pricePerDay: number;
    hp: number;
    imageUrl?: string;
    status: string;
}

export function useFeaturedCars(limit: number = 6) {
    const [cars, setCars] = useState<CarData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await api.get('/car');
                const availableCars = res.data
                    .filter((car: CarData) => car.status === 'AVAILABLE')
                    .slice(0, limit);
                setCars(availableCars);
            } catch (err: any) {
                console.error("Failed to fetch featured cars:", err);
                setError(err.message || "Failed to load cars");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [limit]);

    return { cars, loading, error };
}
