'use client';

interface Props {
  carId: string;
}

export default function BookNowCTAButton({ carId }: Props) {
  const handleBooking = () => {
    alert(`Booking initiated for car ${carId}`);
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
