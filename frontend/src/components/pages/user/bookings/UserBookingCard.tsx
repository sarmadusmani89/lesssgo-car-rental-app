import { Calendar, Car, AlertCircle } from 'lucide-react';

interface Booking {
    id: number | string;
    car: {
        name: string;
        make: string;
        model: string;
        image?: string;
    } | string; // Handle case where car might be just a string title or object
    startDate: string;
    endDate: string;
    status: string;
    totalPrice?: number;
}

interface UserBookingCardProps {
    booking: any; // Using any to be safe with unknown API response structure initially, but will try to cast
    onCancel: (id: string | number) => void;
    cancellingId: string | number | null;
}

export default function UserBookingCard({ booking, onCancel, cancellingId }: UserBookingCardProps) {
    // Helper to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return dateString;
        }
    };

    // Helper to determine status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
            case 'active':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Construct title
    const title = typeof booking.car === 'object'
        ? `${booking.car.make} ${booking.car.model}`
        : (booking.carName || booking.title || 'Car Rental');

    const status = booking.status || 'Pending';
    const isCompleted = status.toLowerCase() === 'completed';
    const isCancelled = status.toLowerCase() === 'cancelled';
    const isActive = status.toLowerCase() === 'active';

    // Can cancel if not completed and not cancelled
    // Assuming 'Active' bookings might also not be cancellable depending on logic, but user request was specifically "remove cancelled button from completed bookings".
    // Usually you can't cancel an active trip via simple button, but let's follow the user's specific request: "remove the cancelled button from completed bookings".
    // Implies it should be there for others, but common sense says not for Cancelled either.
    const canCancel = !isCompleted && !isCancelled;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                                {booking.startDate ? formatDate(booking.startDate) : 'TBD'} - {booking.endDate ? formatDate(booking.endDate) : 'TBD'}
                            </span>
                        </div>
                        {booking.totalPrice && (
                            <div className="font-semibold text-gray-900">
                                ${booking.totalPrice}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Details button could go here if needed, keeping it simple as per request */}

                    {canCancel && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
