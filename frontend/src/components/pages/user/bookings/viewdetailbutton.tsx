'use client';

interface Props {
  bookingId: number;
}

export default function ViewDetailButton({ bookingId }: Props) {
  const handleClick = () => {
    alert(`Viewing details for booking #${bookingId}`);
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
    >
      View Details
    </button>
  );
}
