'use client';

export default function CarDetailsWithImages({ car }: { car: any }) {
  if (!car) return null;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Car Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{car.brand}</span>
            <p className="font-black text-2xl text-slate-900 font-outfit uppercase -mt-1">{car.name}</p>
          </div>
          <p className="text-gray-600 mt-1">Type: {car.type}</p>
          <p className="text-gray-600">Transmission: {car.transmission}</p>
          <p className="text-gray-600">Fuel Capacity: {car.fuelCapacity}L</p>
          <p className="text-gray-600 font-medium text-blue-600 mt-2">${car.pricePerDay} / day</p>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {car.imageUrl && (
            <img
              src={car.imageUrl}
              alt={car.name}
              className="w-full h-48 object-cover rounded-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
