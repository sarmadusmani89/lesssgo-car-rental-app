import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mt-2">
            <p className="text-sm text-muted-foreground font-medium italic">
                Showing <span className="text-foreground font-bold">{startItem}</span> to{' '}
                <span className="text-foreground font-bold">{endItem}</span> of{' '}
                <span className="text-foreground font-bold">{totalItems}</span> items
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-card"
                >
                    <ChevronLeft size={20} />
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                            <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? 'accent' : 'outline'}
                                size="icon"
                                onClick={() => onPageChange(pageNum)}
                                className={`w-10 h-10 ${currentPage === pageNum ? 'shadow-accent/20 text-white' : 'bg-card'}`}
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-card"
                >
                    <ChevronRight size={20} />
                </Button>
            </div>
        </div>
    );
};
