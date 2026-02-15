"use client"

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { Testimonial, CreateTestimonialDto, UpdateTestimonialDto } from '@/types/testimonial';
import TestimonialHeader from '@/components/pages/admin/testimonials/components/TestimonialHeader';
import TestimonialSearch from '@/components/pages/admin/testimonials/components/TestimonialSearch';
import TestimonialTable from '@/components/pages/admin/testimonials/TestimonialTable';
import TestimonialFormModal from '@/components/pages/admin/testimonials/TestimonialFormModal';

export default function AdminTestimonialsPage() {
    const {
        testimonials,
        loading,
        isSubmitting,
        createTestimonial,
        updateTestimonial,
        deleteTestimonial
    } = useTestimonials();

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const handleCreateOrUpdate = async (data: CreateTestimonialDto | UpdateTestimonialDto) => {
        try {
            if (editingTestimonial) {
                await updateTestimonial(editingTestimonial.id, data as UpdateTestimonialDto);
            } else {
                await createTestimonial(data as CreateTestimonialDto);
            }
            setIsModalOpen(false);
            setEditingTestimonial(null);
        } catch (error) {
            // Error handling is managed in the hook (toast)
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
            <TestimonialHeader
                onAddClick={() => {
                    setEditingTestimonial(null);
                    setIsModalOpen(true);
                }}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <TestimonialSearch
                    search={search}
                    onSearchChange={setSearch}
                />

                <TestimonialTable
                    testimonials={filteredTestimonials}
                    onEdit={(t) => {
                        setEditingTestimonial(t);
                        setIsModalOpen(true);
                    }}
                    onDelete={deleteTestimonial}
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
