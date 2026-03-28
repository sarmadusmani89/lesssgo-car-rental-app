'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TestimonialHeaderProps {
    onAddClick: () => void;
}

export default function TestimonialHeader({ onAddClick }: TestimonialHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight  ">
                    Customer <span className="text-primary  ">Testimonials</span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage client reviews and testimonials displayed on the homepage.</p>
            </div>
            <Button
                onClick={onAddClick}
                variant="primary"
                className="flex items-center justify-center gap-2 px-6 py-3 shadow-lg h-auto"
            >
                <Plus size={20} />
                <span>New Testimonial</span>
            </Button>
        </div>
    );
}
