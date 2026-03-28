'use client';

import { Testimonial } from '@/types/testimonial';
import { Edit2, Trash2, Star } from 'lucide-react';
import TestimonialAuthorInfo from './TestimonialAuthorInfo';
import { Button } from '@/components/ui/Button';

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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(testimonial)}
                        className="text-gray-400 hover:text-accent hover:bg-accent/5 rounded-lg h-auto w-auto p-2"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(testimonial.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-auto w-auto p-2"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
