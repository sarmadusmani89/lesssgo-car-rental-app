'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';
import { toast } from 'sonner';

export function useTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminApi.listTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const createTestimonial = async (data: CreateTestimonialDto) => {
        setIsSubmitting(true);
        try {
            const newTestimonial = await adminApi.createTestimonial(data);
            toast.success('Testimonial created successfully');
            setTestimonials(prev => [newTestimonial, ...prev]);
            return newTestimonial;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create testimonial');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateTestimonial = async (id: string, data: UpdateTestimonialDto) => {
        setIsSubmitting(true);
        try {
            const updated = await adminApi.updateTestimonial(id, data);
            toast.success('Testimonial updated successfully');
            setTestimonials(prev => prev.map(t => t.id === id ? updated : t));
            return updated;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update testimonial');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await adminApi.deleteTestimonial(id);
            toast.success('Testimonial deleted successfully');
            setTestimonials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            toast.error('Failed to delete testimonial');
            throw error;
        }
    };

    return {
        testimonials,
        loading,
        isSubmitting,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial,
        refresh: fetchTestimonials
    };
}
