'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from 'sonner';
import styles from './Providers.module.css';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <div className={styles.wrapper}>
                {children}
                <Toaster position="top-right" richColors closeButton />
            </div>
        </Provider>
    );
}
