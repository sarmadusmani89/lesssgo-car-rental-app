'use client';

import { Testimonial } from '@/types/testimonial';
import { Edit2, Trash2, Star } from 'lucide-react';
import TestimonialAuthorInfo from './TestimonialAuthorInfo';

interface TestimonialTableRowProps {
    testimonial: Testimonial;
    onEdit: (testimonial: Testimonial) => void;
    onDelete: (id: string) => void;
}

export default function TestimonialTableRow({
    testimonial,
    onEdit,
    onDelete
}: TestimonialTableRowProps) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4">
                <TestimonialAuthorInfo
                    name={testimonial.name}
                    role={testimonial.role}
                    avatar={testimonial.avatar}
                />
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
    );
}
