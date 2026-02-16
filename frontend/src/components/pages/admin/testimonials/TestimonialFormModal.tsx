'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { CreateTestimonialDto, Testimonial, UpdateTestimonialDto } from '@/types/testimonial';
import TestimonialForm from './components/TestimonialForm';

interface TestimonialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTestimonialDto | UpdateTestimonialDto, imageFile?: File) => Promise<void>;
    testimonial?: Testimonial | null;
    isSubmitting: boolean;
}

export default function TestimonialFormModal({
    isOpen,
    onClose,
    onSubmit,
    testimonial,
    isSubmitting
}: TestimonialFormModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible pointer-events-none'}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                {/* Header */}
                <div className="px-8 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Share user experience with others</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <TestimonialForm
                    onSubmit={onSubmit}
                    onCancel={onClose}
                    testimonial={testimonial}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>,
        document.body
    );
}
