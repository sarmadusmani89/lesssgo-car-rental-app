'use client';

import { ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from 'sonner';
import { initializeWishlist } from '@/lib/store/slices/wishlistSlice';
import styles from './Providers.module.css';

function WishlistInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeWishlist());
    }, [dispatch]);

    return null;
}

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <WishlistInitializer />
            <div className={styles.wrapper}>
                {children}
                <Toaster position="top-right" richColors closeButton />
            </div>
        </Provider>
    );
}
