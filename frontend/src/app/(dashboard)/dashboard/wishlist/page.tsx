"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import CarCard from '@/components/ui/CarCard';
import api from '@/lib/api';
import { Loader2, Heart, Car } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
    const wishlistIds = useSelector((state: RootState) => state.wishlist.items);
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistedCars = async () => {
            if (wishlistIds.length === 0) {
                setCars([]);
                setLoading(false);
                return;
            }

            try {
                // In a real app, you might have a dedicated endpoint for this
                // For now, fetch all and filter client-side, or multiple requests
                const { data } = await api.get('/car');
                const wishlisted = data.filter((car: any) => wishlistIds.includes(car.id));
                setCars(wishlisted);
            } catch (error) {
                console.error("Failed to fetch wishlist cars", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistedCars();
    }, [wishlistIds]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium font-outfit">Loading your wishlist...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit flex items-center gap-3">
                        My Wishlist
                        <span className="text-sm bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-bold">
                            {wishlistIds.length}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1">Your hand-picked selection of premium vehicles.</p>
                </div>
            </div>

            {cars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <CarCard
                            key={car.id}
                            id={car.id}
                            name={car.name}
                            brand={car.brand}
                            price={car.pricePerDay}
                            monthlyPrice={car.pricePerDay * 30}
                            status={car.status}
                            hp={car.hp}
                            fuel={car.fuelType || 'Petrol'}
                            transmission={car.transmission || 'Auto'}
                            image={car.imageUrl || '/images/cars/placeholder.jpg'}
                            passengers={car.passengers}
                            hasAC={car.airConditioner}
                            hasGPS={car.gps}
                            freeCancellation={car.freeCancellation}
                            vehicleClass={car.vehicleClass}
                            slug={car.slug}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-200 mb-6 font-bold">
                        <Heart size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">Your wishlist is empty</h2>
                    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Explore our fleet and save your favorite cars to view them here later.
                    </p>
                    <Link href="/cars" className="btn btn-primary mt-8 px-10">
                        Explore Fleet
                    </Link>
                </div>
            )}
        </div>
    );
}
