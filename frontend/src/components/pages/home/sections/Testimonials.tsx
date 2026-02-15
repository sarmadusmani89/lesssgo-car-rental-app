'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import TestimonialCard from '@/components/common/TestimonialCard/TestimonialCard';
import api from '@/lib/api';
import { Testimonial } from '@/types/testimonial';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

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

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, [testimonials.length]);

    // Auto-play
    useEffect(() => {
        if (testimonials.length <= 3) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length, nextSlide]);

    if (loading) {
        return (
            <div className="py-32 bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    const isCarousel = testimonials.length > 3;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-[800px] mx-auto mb-20">
                    <h2 className="text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">
                        Trusted by <span className="text-blue-600">Excellence.</span>
                    </h2>
                    <p className="text-[#64748b] text-lg lg:text-[1.125rem] leading-relaxed">
                        Don&apos;t just take our word for it. Here&apos;s what our premium clients have to say about their experience.
                    </p>
                </div>

                {!isCarousel ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                ) : (
                    <div className="relative group max-w-6xl mx-auto">
                        <div className="overflow-hidden px-4 md:px-12 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                    {[0, 1, 2].map((offset) => {
                                        const index = (currentIndex + offset) % testimonials.length;
                                        const testimonial = testimonials[index];
                                        return (
                                            <motion.div
                                                key={`${testimonial.id}-${index}`}
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{
                                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                                    opacity: { duration: 0.2 }
                                                }}
                                                className="h-full"
                                            >
                                                <TestimonialCard testimonial={testimonial} />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                            ? "w-8 bg-blue-600"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
