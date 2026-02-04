import { BookingStatus, PaymentStatus } from "../../../../types/booking";

type Props = {
  search: string;
  setSearch: (s: string) => void;
  status: BookingStatus | "";
  setStatus: (s: BookingStatus | "") => void;
  payment: PaymentStatus | "";
  setPayment: (p: PaymentStatus | "") => void;
};


export default function BookingFilters({
  search,
  setSearch,
  status,
  setStatus,
  payment,
  setPayment,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Search by customer or booking ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-60"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as BookingStatus | "")}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        value={payment}
        onChange={(e) => setPayment(e.target.value as PaymentStatus | "")}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Payments</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
        <option value="refunded">Refunded</option>
      </select>
    </div>
  );
}
