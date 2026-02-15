'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { CreateTestimonialDto, Testimonial, UpdateTestimonialDto } from '@/types/testimonial';
import RatingSelector from './RatingSelector';
import FormInput from '@/components/ui/FormInput';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Author Photo</label>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-4 transition-all hover:border-blue-400 hover:bg-blue-50/50"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-gray-400" />
                            )}
                        </div>

                        <div className="flex-1">
                            <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                                {imageFile ? imageFile.name : 'Click to upload photo'}
                            </p>
                            <p className="text-sm text-gray-500">PNG, JPG or WebP (Max. 5MB)</p>
                        </div>

                        <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                            <Upload size={20} />
                        </div>
                    </div>

                    {imagePreview && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImageFile(null);
                                setImagePreview('');
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
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
