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
    COMPLETED: 'bg-accent/10 text-accent border-accent/20',

    // Payment Statuses
    PAID: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    FAILED: 'bg-rose-50 text-rose-600 border-rose-100',

    // Roles
    ADMIN: 'bg-purple-50 text-purple-600 border-purple-100',
    USER: 'bg-muted text-muted-foreground border-border',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
    const normalizedStatus = status.toUpperCase();
    const styleClass = statusStyles[normalizedStatus] || 'bg-muted text-muted-foreground border-border';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${styleClass}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
};
