'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { initializeCurrency } from '@/lib/store/slices/uiSlice';
import { initializeWishlist } from '@/lib/store/slices/wishlistSlice';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(initializeCurrency());
        store.dispatch(initializeWishlist());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
