'use client';

import { AlertTriangle, X, CalendarX } from 'lucide-react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bookingId: string | number;
    carName?: string;
    isCancelling: boolean;
};

export default function CancelBookingModal({
    isOpen,
    onClose,
    onConfirm,
    bookingId,
    carName,
    isCancelling
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in cursor-pointer"
                onClick={isCancelling ? undefined : onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center shadow-inner">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                            <AlertTriangle className="text-amber-600" size={32} />
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 font-outfit mb-2">Cancel Booking?</h3>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                        Are you sure you want to cancel booking <strong className="text-gray-900">#{bookingId.toString().slice(-8).toUpperCase()}</strong>?
                        {carName && (
                            <span className="block mt-1">
                                Vehicle: <strong className="text-gray-900">{carName}</strong>
                            </span>
                        )}
                        <span className="block mt-2 text-amber-600 font-medium text-xs bg-amber-50 py-2 px-3 rounded-lg border border-amber-100">
                            This action cannot be undone.
                        </span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isCancelling}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isCancelling}
                        className="flex-1 py-3 px-4 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isCancelling ? (
                            "Cancelling..."
                        ) : (
                            <>
                                <CalendarX size={18} />
                                Yes, Cancel
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
