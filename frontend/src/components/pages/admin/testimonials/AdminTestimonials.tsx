'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';
import TestimonialTable from './TestimonialTable';
import TestimonialFormModal from './TestimonialFormModal';

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const res = await api.get('/testimonials');
            setTestimonials(res.data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleCreateOrUpdate = async (data: CreateTestimonialDto | UpdateTestimonialDto) => {
        setIsSubmitting(true);
        try {
            if (editingTestimonial) {
                await api.patch(`/testimonials/${editingTestimonial.id}`, data);
                toast.success('Testimonial updated successfully');
            } else {
                await api.post('/testimonials', data);
                toast.success('Testimonial created successfully');
            }
            setIsModalOpen(false);
            setEditingTestimonial(null);
            fetchTestimonials();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await api.delete(`/testimonials/${id}`);
            toast.success('Testimonial deleted successfully');
            fetchTestimonials();
        } catch (error) {
            toast.error('Failed to delete testimonial');
        }
    };

    const filteredTestimonials = testimonials.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.content.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Loading testimonials...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Testimonials</h1>
                    <p className="text-gray-500">Manage client reviews and testimonials displayed on the homepage.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTestimonial(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus size={20} />
                    <span>New Testimonial</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search testimonials..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <TestimonialTable
                    testimonials={filteredTestimonials}
                    onEdit={(t) => {
                        setEditingTestimonial(t);
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                />
            </div>

            <TestimonialFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTestimonial(null);
                }}
                onSubmit={handleCreateOrUpdate}
                testimonial={editingTestimonial}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
