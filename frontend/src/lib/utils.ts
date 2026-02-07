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

