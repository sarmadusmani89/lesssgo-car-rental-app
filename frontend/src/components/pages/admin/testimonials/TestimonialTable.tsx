'use client';

import { Testimonial } from '@/types/testimonial';
import { Edit2, Trash2, Star } from 'lucide-react';

interface TestimonialTableProps {
    testimonials: Testimonial[];
    onEdit: (testimonial: Testimonial) => void;
    onDelete: (id: string) => void;
}

export default function TestimonialTable({ testimonials, onEdit, onDelete }: TestimonialTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {testimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {testimonial.avatar ? (
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-600 max-w-sm truncate">{testimonial.content}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(testimonial.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(testimonial)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(testimonial.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {testimonials.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                No testimonials found. Create your first one!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
