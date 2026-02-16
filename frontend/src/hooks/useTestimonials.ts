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

    const createTestimonial = async (data: CreateTestimonialDto, imageFile?: File) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const newTestimonial = await adminApi.createTestimonial(formData);
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

    const updateTestimonial = async (id: string, data: UpdateTestimonialDto, imageFile?: File) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const updated = await adminApi.updateTestimonial(id, formData);
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
