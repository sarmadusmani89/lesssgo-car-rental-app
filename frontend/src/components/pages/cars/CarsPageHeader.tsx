'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

interface CarsPageHeaderProps {
    totalCars: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function CarsPageHeader({ totalCars, searchQuery, onSearchChange }: CarsPageHeaderProps) {
    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <nav className="flex mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Home</span>
                        <span className="mx-3 text-gray-200">/</span>
                        <span className="text-blue-600">Our Fleet</span>
                    </nav>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 font-outfit uppercase tracking-tighter leading-none">
                        Our <span className="text-blue-600">Elite Fleet</span>
                    </h1>
                    <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl">
                        Discover <b>{totalCars}</b> exceptional vehicles curated for those who demand performance, luxury, and exclusivity.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <input
                            type="text"
                            placeholder="Find your specific model..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 pl-14 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-outfit shadow-sm"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-slate-100 mt-12" />
        </div>
    );
}
