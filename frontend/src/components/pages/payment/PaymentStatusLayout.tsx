'use client';

import React from 'react';

interface PaymentStatusLayoutProps {
    children: React.ReactNode;
    maxWidth?: string;
}

export default function PaymentStatusLayout({ children, maxWidth = 'max-w-4xl' }: PaymentStatusLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-20 pb-40">
            <div className={`${maxWidth} w-full`}>
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-white">
                    {children}
                </div>
            </div>
        </div>
    );
}
