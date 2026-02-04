'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CarQueryRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      // Redirect to the new dynamic route
      const paramsString = searchParams.toString();
      const nextPath = `/car/${id}${paramsString ? '?' + paramsString : ''}`;
      router.replace(nextPath);
    } else {
      // Redirect to the main fleet page if no ID is provided
      router.replace('/cars');
    }
  }, [id, router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Locating vehicle...</p>
    </div>
  );
}

export default function CarBasePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    }>
      <CarQueryRedirect />
    </Suspense>
  );
}
