'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, DollarSign, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking, UpdateBookingDto, BookingStatus, PaymentStatus, BondStatus, PaymentMethod } from '@/types/booking';
import FormInput from '@/components/ui/FormInput';
import { Button } from '@/components/ui/Button';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Amount') ? parseFloat(value) : value
        }));
    };

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
                                {/* Customer Info */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <User size={14} /> Customer Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormInput
                                            label="Name"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FormInput
                                            label="Email"
                                            name="customerEmail"
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FormInput
                                            label="Phone"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                                        <Calendar size={14} /> Rental Period
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput
                                            label="Pick-up Date"
                                            name="startDate"
                                            type="datetime-local"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FormInput
                                            label="Return Date"
                                            name="endDate"
                                            type="datetime-local"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Financials */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                                        <DollarSign size={14} /> Pricing
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <FormInput
                                            label="Total Amount (PGK)"
                                            name="totalAmount"
                                            type="number"
                                            value={formData.totalAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                        <FormInput
                                            label="Security Bond (PGK)"
                                            name="bondAmount"
                                            type="number"
                                            value={formData.bondAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Statuses */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                                        <Loader2 size={14} /> Status Management
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Booking Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-gray-700">Payment Status</label>
                                            <select
                                                name="paymentStatus"
                                                value={formData.paymentStatus}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Locations */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest pt-2">
                                        <MapPin size={14} /> Locations
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput
                                            label="Pick-up Location"
                                            name="pickupLocation"
                                            value={formData.pickupLocation}
                                            onChange={handleChange}
                                        />
                                        <FormInput
                                            label="Return Location"
                                            name="returnLocation"
                                            value={formData.returnLocation}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
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
