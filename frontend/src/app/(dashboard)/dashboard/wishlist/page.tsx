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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My <span className="text-primary">Wishlist</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Your curated selection of premium vehicles for future journeys.</p>
        </div>
        <div className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10">
          {wishlistIds.length} Saved
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
        <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-20 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-slate-200 mb-6 font-bold">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Your wishlist is empty</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">
            Explore our vehicle fleet and save your favorite cars to view them here later.
          </p>
          <Link href="/cars" className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
            Explore Fleet
          </Link>
        </div>
      )}
    </div>
  );
}
