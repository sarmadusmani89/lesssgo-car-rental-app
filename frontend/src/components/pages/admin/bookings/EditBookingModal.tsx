'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking, UpdateBookingDto } from '@/types/booking';
import { Button } from '@/components/ui/Button';
import CustomerInfoFields from './components/edit-modal/CustomerInfoFields';
import RentalPeriodFields from './components/edit-modal/RentalPeriodFields';
import PricingFields from './components/edit-modal/PricingFields';
import StatusFields from './components/edit-modal/StatusFields';
import LocationFields from './components/edit-modal/LocationFields';

interface EditBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking | null;
    onUpdate: (id: string, data: UpdateBookingDto) => Promise<void>;
}

export default function EditBookingModal({
    isOpen,
    onClose,
    booking,
    onUpdate
}: EditBookingModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<UpdateBookingDto>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (booking) {
            setFormData({
                customerName: booking.customerName || '',
                customerEmail: booking.customerEmail || '',
                customerPhone: booking.customerPhone || '',
                startDate: booking.startDate ? new Date(booking.startDate).toISOString().slice(0, 16) : '',
                endDate: booking.endDate ? new Date(booking.endDate).toISOString().slice(0, 16) : '',
                totalAmount: booking.totalAmount,
                bondAmount: booking.bondAmount,
                pickupLocation: booking.pickupLocation || '',
                returnLocation: booking.returnLocation || '',
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                bondStatus: booking.bondStatus,
                paymentMethod: booking.paymentMethod,
            });
        }
    }, [booking]);

    if (!mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;

        setIsSubmitting(true);
        try {
            await onUpdate(booking.id, formData);
            onClose();
        } catch (error) {
            console.error('Failed to update booking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDirectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Amount') ? parseFloat(value) : value
        }));
    };

    // Extract car locations for dropdowns
    const pickupLocations = booking?.car?.pickupLocation || [];
    const returnLocations = booking?.car?.returnLocation || [];

    const pickupOptions = pickupLocations.length > 0
        ? pickupLocations.map((l: string) => ({ label: l, value: l }))
        : (formData.pickupLocation ? [{ label: formData.pickupLocation, value: formData.pickupLocation }] : []);

    const returnOptions = returnLocations.length > 0
        ? returnLocations.map((l: string) => ({ label: l, value: l }))
        : (formData.returnLocation ? [{ label: formData.returnLocation, value: formData.returnLocation }] : []);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                                    Edit <span className="text-blue-600">Booking</span>
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Reference: #{booking?.id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all active:scale-95 shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomerInfoFields formData={formData} onChange={handleDirectChange} />
                                <RentalPeriodFields formData={formData} onChange={handleDirectChange} />
                                <PricingFields formData={formData} onChange={handleDirectChange} />
                                <StatusFields formData={formData} onChange={handleDirectChange} />
                                <LocationFields
                                    formData={formData}
                                    pickupOptions={pickupOptions}
                                    returnOptions={returnOptions}
                                    onChange={handleDirectChange}
                                />
                            </div>

                            {/* Actions */}
                            <div className="mt-10 flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-2xl h-14 uppercase tracking-widest text-sm"
                                    isLoading={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onClose}
                                    className="px-8 rounded-2xl h-14 uppercase tracking-widest text-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
