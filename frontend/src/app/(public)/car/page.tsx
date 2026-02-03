'use client';

import { useSearchParams } from 'next/navigation';
import ImageGalleryWithLightbox from '@/components/pages/vehicle/imagegallerywithlightbox';
import VehicleSpecifications from '@/components/pages/vehicle/vehiclespecification';
import PricingDisplay from '@/components/pages/vehicle/pricingdisplay';
import DateRangePicker from '@/components/pages/vehicle/daterangepicker';
import RealTimeAvailabilityCheck from '@/components/pages/vehicle/realtimeavailibilitycheck';
import TotalCostCalculation from '@/components/pages/vehicle/totalcostcalculation';
import BookNowCTAButton from '@/components/pages/vehicle/booknowctabutton';

// Sample vehicle data (in real app fetch from API)
const vehicles = [
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

export default function VehiclePage() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) return <p className="p-8">Vehicle not found</p>;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">{vehicle.name}</h1>
      <ImageGalleryWithLightbox images={vehicle.images} />
      <VehicleSpecifications specs={vehicle.specs} />
      <PricingDisplay pricePerDay={vehicle.pricePerDay} />
      <DateRangePicker />
      <RealTimeAvailabilityCheck vehicleId={vehicle.id} />
      <TotalCostCalculation pricePerDay={vehicle.pricePerDay} />
      <BookNowCTAButton vehicleId={vehicle.id} />
    </div>
  );
}
