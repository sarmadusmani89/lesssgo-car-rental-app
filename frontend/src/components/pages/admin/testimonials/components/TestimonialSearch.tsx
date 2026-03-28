'use client';

import { Search } from 'lucide-react';

interface TestimonialSearchProps {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function TestimonialSearch({ search, onSearchChange }: TestimonialSearchProps) {
    return (
        <div className="p-4 bg-white/60 backdrop-blur-xl border-b border-white/20">
            <div className="relative max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" size={18} />
                <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                />
            </div>
        </div>
    );
}
