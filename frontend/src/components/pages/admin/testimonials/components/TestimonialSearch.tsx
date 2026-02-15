'use client';

import { Search } from 'lucide-react';

interface TestimonialSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function TestimonialSearch({ search, onSearchChange }: TestimonialSearchProps) {
    return (
        <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>
        </div>
    );
}
