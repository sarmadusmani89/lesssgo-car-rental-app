'use client';

import { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from 'sonner';
import { SWRConfig } from 'swr';
import { initializeWishlist } from '@/lib/store/slices/wishlistSlice';
import { initializeCurrency } from '@/lib/store/slices/uiSlice';
import api, { userApi } from '@/lib/api';
import styles from './Providers.module.css';

function WishlistInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeWishlist());
    }, [dispatch]);

    return null;
}

function CurrencyInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeCurrency());
    }, [dispatch]);

    return null;
}

function AuthInitializer() {
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // This call will trigger the 401 interceptor in api.ts 
                    // if the token is expired, clearing storage and redirecting.
                    await userApi.profile();
                } catch (error) {
                    // Silently fail, interceptor handles the logic
                }
            }
        };

        checkAuth();
    }, []);

    return null;
}

const swrConfig = {
    fetcher: (url: string) => api.get(url).then(res => res.data),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
};

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <SWRConfig value={swrConfig}>
                <WishlistInitializer />
                <CurrencyInitializer />
                <AuthInitializer />
                <div className={styles.wrapper}>
                    {children}
                    <Toaster position="top-right" richColors closeButton />
                </div>
            </SWRConfig>
        </Provider>
    );
}
