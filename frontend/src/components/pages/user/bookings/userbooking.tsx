'use client';

import { useState, useEffect } from 'react';
import { bookingApi } from '@/lib/api';
import UserBookingCard from './UserBookingCard';
import { Loader2, CalendarX } from 'lucide-react';
import { toast } from 'sonner';

export default function UserBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | number | null>(null);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = ['Upcoming', 'Active', 'Completed', 'Cancelled'];

  const fetchBookings = async () => {
    try {
      const data = await bookingApi.list();
      // Assuming API returns an array of bookings
      setBookings(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleCancelBooking = async (id: string | number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(id);
    try {
      // Note: Update this with actual API endpoint when available
      toast.error("Cancellation feature is not yet connected to the backend.");
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  // Filter bookings based on tab
  const filteredBookings = bookings.filter((booking) => {
    const status = (booking.status || 'Upcoming').toLowerCase();
    const tab = activeTab.toLowerCase();

    if (tab === 'upcoming') {
      return status === 'upcoming' || status === 'pending' || status === 'confirmed';
    }
    return status === tab;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                            `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {paginatedBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <CalendarX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()} bookings</h3>
            <p className="text-gray-500">You don't have any bookings in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {paginatedBookings.map((booking) => (
                <UserBookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancelBooking}
                  cancellingId={cancellingId}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
