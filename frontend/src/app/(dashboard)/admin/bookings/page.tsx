"use client";

import { useState } from "react";
import { Booking, BookingStatus, PaymentStatus } from "@/components/pages/admin/bookings/BookingTable";
import BookingTable from "@/components/pages/admin/bookings/BookingTable";
import BookingFilters from "@/components/pages/admin/bookings/BookingFilter";

const BOOKINGS_PER_PAGE = 5;

const initialBookings: Booking[] = [
  {
    id: 1,
    bookingId: "BK-001",
    customerName: "Ali Khan",
    carName: "Honda Civic",
    startDate: "2026-02-01",
    endDate: "2026-02-05",
    totalAmount: 240,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 2,
    bookingId: "BK-002",
    customerName: "Ahmed Raza",
    carName: "Toyota Corolla",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    totalAmount: 120,
    status: "pending",
    paymentStatus: "unpaid",
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // ✅ Correctly typed states
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [payment, setPayment] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState<number>(1);

  // Filter bookings
  const filtered = bookings.filter((b) => {
    return (
      (b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(search.toLowerCase())) &&
      (status ? b.status === status : true) &&
      (payment ? b.paymentStatus === payment : true)
    );
  });

  // Pagination
  const paginated = filtered.slice(
    (page - 1) * BOOKINGS_PER_PAGE,
    page * BOOKINGS_PER_PAGE
  );

  // Update booking status
  const onStatusChange = (id: number, newStatus: BookingStatus) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking Management</h1>

      {/* ✅ BookingFilters props now fully type safe */}
      <BookingFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        payment={payment}
        setPayment={setPayment}
      />

      {/* ✅ BookingTable props now fully type safe */}
      <BookingTable
        bookings={paginated}
        onViewDetails={(b) => router.push(`/admin/bookings/${b.id}`)}
        onUpdate={(b) => onStatusChange(b.id, b.status)}
        onCancel={() => { }}
        page={page}
        setPage={setPage}
        totalPages={Math.ceil(filtered.length / BOOKINGS_PER_PAGE)}
      />

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          disabled={page * BOOKINGS_PER_PAGE >= filtered.length}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
