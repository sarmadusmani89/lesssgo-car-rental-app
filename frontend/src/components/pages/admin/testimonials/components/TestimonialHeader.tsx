'use client';

import { Plus } from 'lucide-react';

interface TestimonialHeaderProps {
    onAddClick: () => void;
}

export default function TestimonialHeader({ onAddClick }: TestimonialHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Testimonials</h1>
                <p className="text-gray-500">Manage client reviews and testimonials displayed on the homepage.</p>
            </div>
            <button
                onClick={onAddClick}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
                <Plus size={20} />
                <span>New Testimonial</span>
            </button>
        </div>
    );
}
