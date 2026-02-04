import React from 'react';

interface StatusBadgeProps {
    status: string;
    type: 'booking' | 'payment' | 'role';
}

const statusStyles: Record<string, string> = {
    // Booking Statuses
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    CONFIRMED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    CANCELLED: 'bg-rose-50 text-rose-600 border-rose-100',
    COMPLETED: 'bg-blue-50 text-blue-600 border-blue-100',

    // Payment Statuses
    PAID: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    FAILED: 'bg-rose-50 text-rose-600 border-rose-100',

    // Roles
    ADMIN: 'bg-purple-50 text-purple-600 border-purple-100',
    USER: 'bg-slate-50 text-slate-600 border-slate-100',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
    const normalizedStatus = status.toUpperCase();
    const styleClass = statusStyles[normalizedStatus] || 'bg-slate-50 text-slate-600 border-slate-100';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${styleClass}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};
