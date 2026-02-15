'use client';

import { Testimonial } from '@/types/testimonial';
import TestimonialTableRow from './components/TestimonialTableRow';

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
                        <TestimonialTableRow
                            key={testimonial.id}
                            testimonial={testimonial}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
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
