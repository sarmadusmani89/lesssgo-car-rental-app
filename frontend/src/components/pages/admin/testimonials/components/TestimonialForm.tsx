'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CreateTestimonialDto, Testimonial, UpdateTestimonialDto } from '@/types/testimonial';
import RatingSelector from './RatingSelector';

interface TestimonialFormProps {
    onSubmit: (data: CreateTestimonialDto | UpdateTestimonialDto) => Promise<void>;
    onCancel: () => void;
    testimonial?: Testimonial | null;
    isSubmitting: boolean;
}

export default function TestimonialForm({
    onSubmit,
    onCancel,
    testimonial,
    isSubmitting
}: TestimonialFormProps) {
    const [formData, setFormData] = useState<CreateTestimonialDto>({
        name: '',
        role: '',
        content: '',
        avatar: '',
        rating: 5
    });

    useEffect(() => {
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                role: testimonial.role || '',
                content: testimonial.content,
                avatar: testimonial.avatar || '',
                rating: testimonial.rating
            });
        } else {
            setFormData({
                name: '',
                role: '',
                content: '',
                avatar: '',
                rating: 5
            });
        }
    }, [testimonial]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Author Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Role / Position</label>
                    <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. CEO at Company"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Content</label>
                <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                    placeholder="What did they say?"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Avatar URL (Optional)</label>
                <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="https://example.com/avatar.jpg"
                />
            </div>

            <RatingSelector
                rating={formData.rating || 5}
                onChange={(rating) => setFormData({ ...formData, rating })}
            />

            <div className="pt-4 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {testimonial ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
}
