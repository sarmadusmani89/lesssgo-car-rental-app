import MetricsCards from "@/components/pages/admin/dashboard/MetricsCard";
import RevenueChart from "@/components/pages/admin/dashboard/RevenueChart";
import RecentBookingsTable from "@/components/pages/admin/dashboard/BookingsTable";
import AvailabilityCalendar from "@/components/pages/admin/dashboard/AvailabilityCalendar";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <AvailabilityCalendar />
      </div>

      <RecentBookingsTable />
    </div>
  );
}
