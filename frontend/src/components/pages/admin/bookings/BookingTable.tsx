"use client";
import { useState } from "react";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";


type Props = {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
  onUpdate: (b: Booking) => void; // renamed to onUpdate for clarity
  onCancel: (id: number) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
};

export interface Booking {
  id: number;              // Unique numeric ID
  bookingId: string;       // e.g., "BK-001"
  customerName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}
const statusOptions = ["pending", "confirmed", "completed", "cancelled"];
const paymentOptions = ["paid", "unpaid", "refunded"];


export default function BookingsTable({
  bookings,
  onViewDetails,
  onUpdate,
  onCancel,
  page,
  setPage,
  totalPages,
}: Props) {
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Partial<Booking>>({});

  const filteredBookings = bookings.filter((b) => {
    return (
      (!filterStatus || b.status === filterStatus) &&
      (!filterPayment || b.paymentStatus === filterPayment) &&
      (!filterStartDate || b.startDate >= filterStartDate) &&
      (!filterEndDate || b.endDate <= filterEndDate)
    );
  });

  const handleEditClick = (b: Booking) => {
    setEditingBookingId(b.id);
    setEditingData({ ...b });
  };

  const handleSave = () => {
    if (editingBookingId !== null) {
      onUpdate(editingData as Booking);
      setEditingBookingId(null);
      setEditingData({});
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <option value="">All Payments</option>
          {paymentOptions.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>


        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Booking ID</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Car</th>
              <th className="p-3 border">Payment</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Start Date</th>
              <th className="p-3 border">End Date</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-5 text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{b.bookingId}</td>
                <td className="border p-3">{b.customerName}</td>
                <td className="border p-3">{b.carName}</td>
                <td className="border p-3">{b.paymentStatus}</td>
                <td className="border p-3">
                  {editingBookingId === b.id ? (
                    <select
                      value={editingData.status}
                      onChange={(e) =>
                        setEditingData((prev) => ({ ...prev, status: e.target.value as any }))
                      }
                      className="border px-2 py-1 rounded"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}

                    </select>
                  ) : (
                    <span>{b.status}</span>
                  )}
                </td>
                <td className="border p-3">{b.startDate}</td>
                <td className="border p-3">{b.endDate}</td>
                <td className="border p-3 flex gap-2">
                  <button
                    onClick={() => onViewDetails(b)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                  {editingBookingId === b.id ? (
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(b)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(b.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
