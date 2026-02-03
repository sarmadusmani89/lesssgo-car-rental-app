// app/admin/bookings/BookingActions.tsx
"use client";
import React from "react";
import { Booking } from "./BookingTable";

type Props = {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onCancel: (id: number) => void;
};

export default function BookingActions({ booking, onViewDetails, onEdit, onCancel }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border divide-y divide-gray-100 z-50">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onViewDetails(booking);
              setOpen(false);
            }}
          >
            View Details
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              onEdit(booking);
              setOpen(false);
            }}
          >
            Edit Booking
          </button>
          {booking.status !== "Cancelled" && (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={() => {
                onCancel(booking.id);
                setOpen(false);
              }}
            >
              Cancel Booking
            </button>
          )}
        </div>
      )}
    </div>
  );
}
