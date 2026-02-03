'use client';

import { useSearchParams } from 'next/navigation';
import ImageGalleryWithLightbox from '@/components/pages/car/imagegallerywithlightbox';
import CarSpecifications from '@/components/pages/car/carspecification';
import PricingDisplay from '@/components/pages/car/pricingdisplay';
import DateRangePicker from '@/components/pages/car/daterangepicker';
import RealTimeAvailabilityCheck from '@/components/pages/car/realtimeavailibilitycheck';
import TotalCostCalculation from '@/components/pages/car/totalcostcalculation';
import BookNowCTAButton from '@/components/pages/car/booknowctabutton';

// Sample car data (in real app fetch from API)
const cars = [
  {
    id: '1',
    name: 'Tesla Model X',
    images: ['/images/tesla1.jpg', '/images/tesla2.jpg'],
    specs: { seats: 5, type: 'SUV', fuel: 'Electric' },
    pricePerDay: 200,
  },
  {
    id: '2',
    name: 'BMW i8',
    images: ['/images/bmw1.jpg', '/images/bmw2.jpg'],
    specs: { seats: 2, type: 'Coupe', fuel: 'Hybrid' },
    pricePerDay: 180,
  },
];

export default function CarPage() {
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  const car = cars.find((v) => v.id === carId);

  if (!car) return <p className="p-8">Car not found</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">{car.name}</h1>
      <ImageGalleryWithLightbox images={car.images} />
      <CarSpecifications specs={car.specs} />
      <PricingDisplay pricePerDay={car.pricePerDay} />
      <DateRangePicker />
      <RealTimeAvailabilityCheck carId={car.id} />
      <TotalCostCalculation pricePerDay={car.pricePerDay} />
      <BookNowCTAButton carId={car.id} />
    </div>
  );
}
