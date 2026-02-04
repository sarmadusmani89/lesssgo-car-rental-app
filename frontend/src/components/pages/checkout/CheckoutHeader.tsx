'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CheckoutHeaderProps {
    carId: string | null;
}

export default function CheckoutHeader({ carId }: CheckoutHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-100 mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <Link
                    href={carId ? `/car?id=${carId}` : '/vehicles'}
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={14} className="mr-2" />
                    Back to vehicle
                </Link>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 font-outfit uppercase tracking-tighter leading-none">
                    Complete your <span className="text-blue-600">Reservation</span>
                </h1>
                <p className="text-gray-400 mt-3 text-sm font-bold uppercase tracking-[0.3em]">
                    Exquisite <span className="text-blue-600/50">Professional Registry</span>
                </p>
            </div>
        </div>
    );
}
