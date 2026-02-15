'use client';

import { useState, useEffect } from 'react';
import TestimonialCard from '@/components/common/TestimonialCard/TestimonialCard';
import api from '@/lib/api';
import { Testimonial } from '@/types/testimonial';
import { Loader2 } from 'lucide-react';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('/testimonials');
                setTestimonials(res.data);
            } catch (error) {
                console.error('Failed to fetch testimonials:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="py-32 bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (testimonials.length === 0) {
        return null; // Don't show the section if no testimonials
    }

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-[800px] mx-auto mb-20">
                    <h2 className="text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Trusted by <span className="text-blue-600">Excellence.</span></h2>
                    <p className="text-[#64748b] text-lg lg:text-[1.125rem] leading-relaxed">Don&apos;t just take our word for it. Here&apos;s what our premium clients have to say about their experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
