'use client';

import { Suspense } from 'react';
import CarsLayout from '@/components/pages/cars/CarsLayout';

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading cars...</p>
        </div>
      </div>
    }>
      <CarsLayout />
    </Suspense>
  );
}
