'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ImageGalleryWithLightbox from '@/components/pages/car/imagegallerywithlightbox';
import CarSpecifications from '@/components/pages/car/carspecification';
import PricingDisplay from '@/components/pages/car/pricingdisplay';
import DateRangePicker from '@/components/pages/car/daterangepicker';
import RealTimeAvailabilityCheck from '@/components/pages/car/realtimeavailibilitycheck';
import TotalCostCalculation from '@/components/pages/car/totalcostcalculation';
import BookNowCTAButton from '@/components/pages/car/booknowctabutton';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import AvailabilityCalendar from '@/components/pages/admin/dashboard/AvailabilityCalendar';

interface Car {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  pricePerDay: number;
  type: string;
  transmission: string;
  fuelCapacity: number;
  description: string;
}

function CarContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });

  useEffect(() => {
    if (!carId) return;

    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/car/${carId}`);
        setCar(res.data);
      } catch (error) {
        console.error("Failed to fetch car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!car) return <p className="p-8 text-center text-gray-500">Car not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images & Specs */}
        <div className="space-y-8">
          <div>
            <nav className="flex mb-4 text-sm text-gray-500 font-medium">
              <span>Vehicles</span>
              <span className="mx-2">/</span>
              <span className="text-blue-600">{car.brand}</span>
            </nav>
            <h1 className="text-4xl font-black text-gray-900 font-outfit uppercase tracking-tight">
              {car.brand} <span className="text-blue-600">{car.name}</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg underline">{car.type} Series</p>
          </div>

          <ImageGalleryWithLightbox images={car.imageUrl ? [car.imageUrl] : []} />

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-50">
            <h3 className="text-xl font-bold mb-4 font-outfit">About this vehicle</h3>
            <p className="text-gray-600 leading-relaxed">{car.description || "No description available for this luxury vehicle."}</p>
          </div>

          <AvailabilityCalendar carId={car.id} carName={car.name} />

          <CarSpecifications specs={{
            seats: 5,
            type: car.type,
            fuel: `${car.fuelCapacity}L`,
            transmission: car.transmission
          }} />
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <PricingDisplay pricePerDay={car.pricePerDay} />

          <DateRangePicker
            startDate={dates.startDate}
            endDate={dates.endDate}
            onChange={(start, end) => setDates({ startDate: start, endDate: end })}
          />

          <RealTimeAvailabilityCheck
            carId={car.id}
            startDate={dates.startDate}
            endDate={dates.endDate}
          />

          <TotalCostCalculation
            pricePerDay={car.pricePerDay}
            startDate={dates.startDate}
            endDate={dates.endDate}
          />

          <BookNowCTAButton
            carId={car.id}
            startDate={dates.startDate}
            endDate={dates.endDate}
            disabled={!dates.startDate || !dates.endDate}
          />
        </div>
      </div>
    </div>
  );
}

export default function CarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <CarContent />
    </Suspense>
  );
}
