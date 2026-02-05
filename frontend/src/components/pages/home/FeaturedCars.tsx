"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';
import CarCard from '../../ui/CarCard';
import api from '@/lib/api';

interface CarData {
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

export default function FeaturedCars() {
    const [cars, setCars] = useState<CarData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await api.get('/car');
                // Filter: Only display AVAILABLE cars
                const availableCars = res.data
                    .filter((car: CarData) => car.status === 'AVAILABLE')
                    .slice(0, 6);
                setCars(availableCars);
            } catch (error) {
                console.error("Failed to fetch featured cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const mapCarToProps = (car: any) => {
        return {
            id: car.id,
            brand: car.brand,
            name: car.name,
            price: car.pricePerDay,
            monthlyPrice: car.pricePerDay * 30,
            image: car.imageUrl || '/images/cars/placeholder.jpg',
            status: car.status,
            hp: car.hp,
            type: car.type,
            fuel: car.fuelType || 'Petrol',
            transmission: car.transmission || 'Auto',
            passengers: car.passengers,
            hasAC: car.airConditioner,
            hasGPS: car.gps,
            freeCancellation: car.freeCancellation,
        };
    };

    return (
        <section className={styles.carsSection}>
            <div className="container">
                <div className={styles.sectionHeaderCentered}>
                    <h2 className={styles.sectionTitle}>Featured Cars</h2>
                    <p className={styles.sectionSubtitle}>Discover our hand-picked selection of high-performance cars from our real-time fleet.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                        <p className="text-gray-500 font-medium font-outfit">Loading fleet...</p>
                    </div>
                ) : cars.length > 0 ? (
                    <div className={styles.carGrid}>
                        {cars.map((car) => (
                            <CarCard key={car.id} {...mapCarToProps(car)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 font-medium">No cars currently available. Please check back later.</p>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                    <Link href="/cars" className="btn btn-outline btn-lg">
                        View All Cars <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
