'use client';

export default function BookingSummary() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-2">
      <h2 className="text-lg font-semibold">Booking Summary</h2>

      <div className="flex justify-between text-gray-700">
        <span>Vehicle</span>
        <span>Tesla Model X</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Rental Dates</span>
        <span>12 Oct – 15 Oct</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Total Days</span>
        <span>3</span>
      </div>

      <div className="flex justify-between font-semibold">
        <span>Total Price</span>
        <span>$600</span>
      </div>
    </div>
  );
}
