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
                    <nav className="flex mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                        <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => window.location.href = '/'}>Home</span>
                        <span className="mx-3 text-border">/</span>
                        <span className="text-primary">Our Fleet</span>
                    </nav>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#020617] uppercase tracking-tighter leading-none">
                        Our <span className="text-primary">Elite Fleet</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg font-medium max-w-xl">
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
                            className="w-full bg-card border border-border rounded-2xl py-4 px-6 pl-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-border mt-12" />
        </div>
    );
}
