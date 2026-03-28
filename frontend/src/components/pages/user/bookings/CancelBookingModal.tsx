'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CalendarX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={isCancelling ? undefined : onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 pt-7 text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-rose-600" size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                                Cancel <span className="text-rose-600">Booking</span>?
                            </h3>

                            <div className="text-slate-500 text-sm font-medium mb-8 space-y-1">
                                <p>Are you sure you want to cancel booking <span className="text-slate-900 font-bold">#{bookingId.toString().slice(-8).toUpperCase()}</span>?</p>
                                {carName && (
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Vehicle: <span className="text-slate-900">{carName}</span></p>
                                )}
                                <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/50 text-[10px] font-black uppercase tracking-[0.2em]">
                                    This action cannot be undone
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={onConfirm}
                                    isLoading={isCancelling}
                                    variant="danger"
                                    className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-100"
                                >
                                    {!isCancelling && <CalendarX size={18} />}
                                    Confirm Cancellation
                                </Button>

                                <Button
                                    onClick={onClose}
                                    disabled={isCancelling}
                                    variant="secondary"
                                    className="w-full py-4 bg-slate-50 text-slate-500 border-none rounded-2xl font-bold text-sm hover:bg-slate-100"
                                >
                                    Keep Booking
                                </Button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={isCancelling}
                            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
