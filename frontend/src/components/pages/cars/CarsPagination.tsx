'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function CarsPagination({ currentPage, totalPages, onPageChange }: CarsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-16">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all font-bold"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
                            : 'bg-white border border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                            }`}
                    >
                        {page.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all font-bold"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
