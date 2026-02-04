'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingStatesDuringPayment() {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] flex flex-col items-center gap-4 border border-blue-100 shadow-blue-50 shadow-2xl">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Securing your reservation...</p>
    </div>
  );
}
