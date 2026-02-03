'use client';

interface Props {
  bookingId: number;
}

export default function CancelBooking({ bookingId }: Props) {
  const handleCancel = () => {
    const confirmCancel = confirm(`Are you sure you want to cancel booking #${bookingId}?`);
    if (confirmCancel) alert(`Booking #${bookingId} cancelled`);
  };

  return (
    <button
      onClick={handleCancel}
      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Cancel
    </button>
  );
}
