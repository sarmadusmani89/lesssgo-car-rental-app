'use client';

import { X } from 'lucide-react';
import { CreateTestimonialDto, Testimonial, UpdateTestimonialDto } from '@/types/testimonial';
import TestimonialForm from './components/TestimonialForm';

interface TestimonialFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTestimonialDto | UpdateTestimonialDto) => Promise<void>;
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">
                        {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-900"
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
        </div>
    );
}
