import { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Car } from 'lucide-react';
import api from '@/lib/api';
import { formatDashboardDate } from '@/lib/utils';

interface BookingsViewProps {
    userId: number;
}

export default function BookingsView({ userId }: BookingsViewProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get(`/booking/user/${userId}`);
                setBookings(res.data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchBookings();
        }
    }, [userId]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your bookings...</div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="animate-slide-up text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold font-outfit mb-2">No Bookings Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    You haven't made any reservations yet. Explore our fleet and book your dream car today.
                </p>
                <a href="/vehicles" className="btn btn-primary">Browse Vehicles</a>
            </div>
        );
    }

    return (
        <div className="animate-slide-up">
            <h2 className="font-outfit text-2xl mb-6">My Bookings</h2>
            <div className="grid gap-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="glass p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all">
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg font-outfit flex items-center gap-2">
                                        <Car size={18} className="text-blue-600" />
                                        {booking.car?.brand} {booking.car?.model}
                                    </h3>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-2 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">${booking.totalAmount}</div>
                                    <div className="text-xs text-gray-500">Total Amount</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>
                                        {formatDashboardDate(booking.startDate)} - {formatDashboardDate(booking.endDate)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>
                                        Duration: {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
