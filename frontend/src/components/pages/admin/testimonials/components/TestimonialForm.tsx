'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CreateTestimonialDto, Testimonial, UpdateTestimonialDto } from '@/types/testimonial';
import RatingSelector from './RatingSelector';
import FormInput from '@/components/ui/FormInput';
import ImageUpload from '@/components/ui/ImageUpload';

interface TestimonialFormProps {
    onSubmit: (data: CreateTestimonialDto | UpdateTestimonialDto, imageFile?: File) => Promise<void>;
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

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                role: testimonial.role || '',
                content: testimonial.content,
                avatar: testimonial.avatar || '',
                rating: testimonial.rating
            });
            setImagePreview(testimonial.avatar || '');
        } else {
            setFormData({
                name: '',
                role: '',
                content: '',
                avatar: '',
                rating: 5
            });
            setImagePreview('');
            setImageFile(null);
        }
    }, [testimonial]);

    const handleImageChange = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, imageFile || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    label="Author Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                />
                <FormInput
                    label="Role / Position"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. CEO at Company"
                />
            </div>

            <FormInput
                label="Content"
                required
                isTextArea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: (e.target as HTMLTextAreaElement).value })}
                placeholder="What did they say?"
            />

            <ImageUpload
                label="Author Photo"
                imagePreview={imagePreview}
                imageFile={imageFile}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
            />

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
