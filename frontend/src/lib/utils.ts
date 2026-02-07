import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CurrencyRates {
    USD: number;
    PGK: number;
    AUD: number;
}

export function formatPrice(amount: number, currency: 'AUD' | 'PGK' | 'USD' = 'AUD', rates?: CurrencyRates) {
    let symbol = '$';
    if (currency === 'PGK') symbol = 'K';
    if (currency === 'AUD') symbol = 'A$';

    // Use provided rates or fallback to defaults
    const currentRates = rates || { AUD: 1, USD: 0.65, PGK: 2.6 };
    const factor = currentRates[currency] || 1;

    const value = amount * factor;
    return `${symbol}${value.toLocaleString('en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    })}`;
}

export function toUtcDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    // If it doesn't have a timezone indicator, append Z to treat it as UTC Wall-Clock
    const normalized = (dateStr.includes('Z') || dateStr.includes('+') || (dateStr.includes('-') && dateStr.includes('T') && dateStr.split('T')[1].includes('-')))
        ? dateStr
        : `${dateStr}:00Z`;
    return new Date(normalized);
}

export function formatDashboardDate(dateStr: string, includeTime = true) {
    if (!dateStr) return '...';
    try {
        const date = toUtcDate(dateStr);
        return date.toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: includeTime ? '2-digit' : undefined,
            minute: includeTime ? '2-digit' : undefined,
            hour12: false,
            timeZone: 'UTC'
        });
    } catch (e) {
        return dateStr;
    }
}

