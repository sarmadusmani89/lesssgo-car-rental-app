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
import { Button } from '../../../ui/Button';
import { useRouter } from 'next/navigation';
import { useBookings } from '../../../../hooks/useBookings';
import BookingTable from './BookingTable';
import { BookingFilters } from './BookingFilters';
import { Pagination } from '../../../ui/Pagination';
import { TableSkeleton } from '../../../ui/Skeletons';
import { toast } from 'sonner';
import { BookingStatus, PaymentStatus } from '../../../../types/booking';

export default function AdminBookings() {
    const { bookings, isLoading, refreshBookings, updateBookingStatus, confirmPayment } = useBookings();
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
                booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                booking.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
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

    const handleConfirmPayment = async (id: string) => {
        try {
            await confirmPayment(id);
            toast.success('Payment confirmed successfully');
        } catch (err) {
            toast.error('Failed to confirm payment');
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
            b.user?.name || 'N/A',
            b.user?.email || 'N/A',
            b.car?.name || 'N/A',
            new Date(b.startDate).toLocaleDateString('en-AU', { timeZone: 'UTC' }),
            new Date(b.endDate).toLocaleDateString('en-AU', { timeZone: 'UTC' }),
            `K${b.totalAmount}`,
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
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                        className="bg-white border-slate-200 text-slate-600 hover:text-accent shadow-sm group"
                    >
                        {!isRefreshing && <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />}
                    </Button>
                    <Button
                        onClick={handleExport}
                        variant="primary"
                        className="flex items-center gap-2 px-6 py-2.5 shadow-lg h-auto"
                    >
                        <Download size={20} />
                        Export
                    </Button>
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
                        onConfirmPayment={handleConfirmPayment}
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
