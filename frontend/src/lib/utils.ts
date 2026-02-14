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

export function formatPrice(amount: number, currency: 'AUD' | 'PGK' | 'USD' = 'PGK', rates?: CurrencyRates) {
    let symbol = 'K';
    if (currency === 'PGK') symbol = 'K';
    if (currency === 'AUD') symbol = 'A$';
    if (currency === 'USD') symbol = '$';

    // Use provided rates or fallback to defaults
    const currentRates = rates || { AUD: 0.38, USD: 0.25, PGK: 1 };
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

export function calculateRentalDays(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === 'string' ? toUtcDate(startDate) : startDate;
    const end = typeof endDate === 'string' ? toUtcDate(endDate) : endDate;

    if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

    const diffTime = end.getTime() - start.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);

    // Calculate days based on 24-hour cycles
    // Each fraction of a 24-hour period counts as a full day
    // Ensure at least 1 day
    return Math.max(1, Math.ceil(diffHours / 24));
}


export function formatAustralianPhone(value: string) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 5) return phoneNumber;
    if (phoneNumberLength < 8) {
        return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    }
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 10)}`;
}

export function stripPhone(value: string) {
    return value.replace(/[^\d]/g, '');
}

export function mapToAustralianPrefix(value: string) {
    const cleaned = stripPhone(value);
    if (!cleaned) return '';
    const final = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
    return `+61 ${final}`;
}

export function displayPhone(phone?: string) {
    if (!phone) return 'N/A';
    const cleaned = phone.trim();
    // If it starts with +675, strip it for local formatting (7XXX XXXX)
    const local = cleaned.startsWith('+675') ? cleaned.slice(4).trim() : cleaned;
    return formatPNGPhone(local);
}

// Papua New Guinea Phone Formatting (e.g. 7XXX XXXX)
export function formatPNGPhone(value: string) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 5) return phoneNumber;
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 8)}`;
}

export function mapToPNGPrefix(value: string) {
    const cleaned = stripPhone(value);
    if (!cleaned) return '';
    return `+675 ${cleaned}`;
}


