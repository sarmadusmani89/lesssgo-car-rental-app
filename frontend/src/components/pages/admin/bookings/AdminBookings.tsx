'use client';

import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    RefreshCw,
    Download,
    Calendar as CalendarIcon,
    ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookings } from '../../../../hooks/useBookings';
import BookingTable from './BookingTable';
import { BookingFilters } from './BookingFilters';
import { Pagination } from '../../../ui/Pagination';
import { TableSkeleton } from '../../../ui/Skeletons';
import { toast } from 'sonner';
import { BookingStatus, PaymentStatus } from '../../../../types/booking';

export default function AdminBookings() {
    const { bookings, isLoading, refreshBookings, updateBookingStatus } = useBookings();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const itemsPerPage = 10;

    // Filter Logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const shortId = booking.id.slice(-8).toUpperCase();
            const matchesSearch =
                booking.id.toLowerCase().includes(search.toLowerCase()) ||
                shortId.includes(search.toUpperCase()) ||
                booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
                booking.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
                booking.car?.name?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
            const matchesPayment = paymentFilter === 'ALL' || booking.paymentStatus === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [bookings, search, statusFilter, paymentFilter]);

    // Pagination
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(start, start + itemsPerPage);
    }, [filteredBookings, currentPage]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshBookings();
            toast.success('Bookings synchronized');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: BookingStatus) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(`Booking ${status.toLowerCase()} successfully`);
        } catch (err) {
            toast.error('Failed to update booking status');
        }
    };

    const handleViewDetails = (booking: any) => {
        router.push(`/admin/bookings/${booking.id}`);
    };

    const handleExport = () => {
        if (filteredBookings.length === 0) {
            toast.error('No bookings to export');
            return;
        }

        const headers = ['Order ID', 'Short ID', 'Customer', 'Email', 'Car', 'Pick-up', 'Return', 'Amount', 'Status', 'Payment'];
        const csvRows = filteredBookings.map(b => [
            b.id,
            b.id.slice(-8).toUpperCase(),
            b.customerName,
            b.customerEmail,
            b.car?.name || 'N/A',
            new Date(b.startDate).toLocaleDateString(),
            new Date(b.endDate).toLocaleDateString(),
            `$${b.totalAmount}`,
            b.status,
            b.paymentStatus
        ]);

        const csvContent = [headers, ...csvRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${filteredBookings.length} bookings successfully`);
    };

    if (isLoading && bookings.length === 0) {
        return <TableSkeleton rows={10} cols={7} />;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
                        Booking Records
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Monitor active rentals, process confirmations, and manage customer reservations.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 group"
                    >
                        <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                        <Download size={20} />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <BookingFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                paymentFilter={paymentFilter}
                onPaymentFilterChange={setPaymentFilter}
            />

            {/* Content Area */}
            {filteredBookings.length > 0 ? (
                <>
                    <BookingTable
                        bookings={paginatedBookings}
                        onStatusUpdate={handleStatusUpdate}
                        onViewDetails={handleViewDetails}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredBookings.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <CalendarIcon className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No bookings found</h3>
                    <p className="text-slate-500 mt-2 max-w-xs font-medium">
                        Adjust your search filters to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    );
}
