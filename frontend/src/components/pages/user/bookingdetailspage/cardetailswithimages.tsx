'use client';

export default function CarDetailsWithImages() {
  const images = ['/images/car1.jpg', '/images/car2.jpg', '/images/car3.jpg'];

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Car Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Car: Tesla Model X</p>
          <p className="text-gray-600">License Plate: XYZ-123</p>
          <p className="text-gray-600">Type: SUV</p>
          <p className="text-gray-600">Seats: 5</p>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Car Image ${i + 1}`}
              className="w-32 h-20 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
