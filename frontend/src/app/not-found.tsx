'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Search, Car } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">

                {/* Illustration */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-50"></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg transform rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Car size={80} className="text-blue-600" />
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            404
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 font-outfit tracking-tight">
                        Off Road!
                    </h1>
                    <p className="text-lg text-gray-600 font-medium">
                        It seems we took a wrong turn. The page you are looking for is parked elsewhere or doesn't exist.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-200"
                    >
                        <Home size={18} />
                        Return Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-gray-200 mt-8">
                    <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-wider">Popular Destinations</p>
                    <div className="flex justify-center gap-6 text-sm font-semibold text-blue-600">
                        <Link href="/cars" className="hover:underline hover:text-blue-800 transition-colors">Browse Cars</Link>
                        <Link href="/contact" className="hover:underline hover:text-blue-800 transition-colors">Contact Support</Link>
                        <Link href="/faq" className="hover:underline hover:text-blue-800 transition-colors">FAQ</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
