import useSWR from 'swr';
import { adminApi } from '../lib/api';
import { Booking, BookingStatus } from '../types/booking';

export function useBookings() {
    const { data, error, mutate, isLoading } = useSWR<Booking[]>('/booking', adminApi.listBookings, {
        revalidateOnFocus: false,
        dedupingInterval: 5000,
    });

    const updateBookingStatus = async (id: string, status: BookingStatus) => {
        try {
            const updatedBooking = await adminApi.updateBooking(id, { status });
            mutate(data?.map(b => (b.id === id ? updatedBooking : b)), false);
            return updatedBooking;
        } catch (err) {
            throw err;
        }
    };

    const updatePaymentStatus = async (id: string, paymentStatus: any) => {
        try {
            const updatedBooking = await adminApi.updateBooking(id, { paymentStatus });
            mutate(data?.map(b => (b.id === id ? updatedBooking : b)), false);
            return updatedBooking;
        } catch (err) {
            throw err;
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            await adminApi.deleteBooking(id);
            mutate(data?.filter(b => b.id !== id), false);
        } catch (err) {
            throw err;
        }
    };

    const confirmPayment = async (id: string) => {
        try {
            const updatedBooking = await adminApi.confirmPayment(id);
            mutate(data?.map(b => (b.id === id ? updatedBooking : b)), false);
            return updatedBooking;
        } catch (err) {
            throw err;
        }
    };

    return {
        bookings: data || [],
        isLoading,
        isError: error,
        updateBookingStatus,
        updatePaymentStatus,
        confirmPayment,
        deleteBooking,
        refreshBookings: mutate,
    };
}
