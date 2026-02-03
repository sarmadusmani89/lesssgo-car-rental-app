'use client';

interface Props {
  vehicleId: string;
}

export default function BookNowCTAButton({ vehicleId }: Props) {
  const handleBooking = () => {
    alert(`Booking initiated for vehicle ${vehicleId}`);
  };

  return (
    <button
      onClick={handleBooking}
      className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
    >
      Book Now
    </button>
  );
}
