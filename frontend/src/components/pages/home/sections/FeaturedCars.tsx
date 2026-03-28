"use client";

import { ArrowRight, Loader2 } from 'lucide-react';
import CarCard from '@/components/ui/CarCard';
import { useFeaturedCars } from '@/hooks/useFeaturedCars';
import { Button } from '@/components/ui/Button';

export default function FeaturedCars() {
    const { cars, loading } = useFeaturedCars(6);

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
            vehicleClass: car.vehicleClass,
            slug: car.slug,
        };
    };

    return (
        <section className="py-[100px] bg-secondary/40">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-[4rem] font-extrabold mb-4 text-[#020617] tracking-tight">Featured <span className="text-primary">Cars</span></h2>
                    <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">Discover our hand-picked selection of high-performance cars from our real-time fleet.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-accent mb-4" size={40} />
                        <p className="text-muted-foreground font-medium">Loading fleet...</p>
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.map((car) => (
                            <CarCard key={car.id} {...mapCarToProps(car)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground font-medium">No cars currently available. Please check back later.</p>
                    </div>
                )}

                <div className="text-center mt-20">
                    <Button href="/cars" variant="outline" size="lg" className="hover:-translate-y-1">
                        View All Cars <ArrowRight size={20} />
                    </Button>
                </div>
            </div>
        </section>
    );
}
