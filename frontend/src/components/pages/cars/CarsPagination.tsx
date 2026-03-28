'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CarsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function CarsPagination({ currentPage, totalPages, onPageChange }: CarsPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-16">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-12 h-12 bg-card"
            >
                <ChevronLeft size={20} />
            </Button>

            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'accent' : 'outline'}
                        size="icon"
                        onClick={() => onPageChange(page)}
                        className={`w-12 h-12 ${currentPage === page ? 'shadow-accent/20 text-white translate-y-[-2px]' : 'bg-card'}`}
                    >
                        {page.toString().padStart(2, '0')}
                    </Button>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-12 h-12 bg-card"
            >
                <ChevronRight size={20} />
            </Button>
        </div>
    );
}
