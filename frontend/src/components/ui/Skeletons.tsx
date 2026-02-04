import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 6 }) => {
    return (
        <div className="w-full space-y-4 animate-pulse">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-12 bg-slate-50 border-b border-slate-100"></div>
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex gap-4 px-6 py-5">
                            {Array.from({ length: cols }).map((_, j) => (
                                <div key={j} className={`h-4 bg-slate-100 rounded flex-1 ${j === cols - 1 ? 'max-w-[100px] ml-auto' : ''}`}></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CardSkeleton: React.FC<{ cards?: number }> = ({ cards = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: cards }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-slate-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded"></div>
                            <div className="h-3 w-48 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                    <div className="h-32 bg-slate-50 rounded-xl mb-6"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-6 w-20 bg-slate-200 rounded-lg"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};
