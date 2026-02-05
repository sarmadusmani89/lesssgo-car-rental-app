import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: 'AUD' | 'PGK' = 'AUD') {
    const symbol = currency === 'AUD' ? '$' : 'K';
    // Assume base price is in AUD. If PGK, we might convert (e.g. 1 AUD = 2.6 PGK)
    // For now, let's just use the symbol as per user's standard
    const factor = currency === 'PGK' ? 2.6 : 1;
    const value = amount * factor;
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
