'use client';

import { CreditCard, Truck } from 'lucide-react';

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

export default function PaymentMethodSelection({
  selected,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 p-8 border border-gray-100">
      <h2 className="text-xl font-black text-gray-900 font-outfit mb-6 uppercase tracking-tight">Payment Method</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('ONLINE')}
          className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 ${selected === 'ONLINE'
            ? 'border-blue-600 bg-blue-600 shadow-xl shadow-blue-600/20 scale-[1.02] text-white'
            : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'
            }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selected === 'ONLINE' ? 'bg-white/20 text-white' : 'bg-white text-gray-400'
            }`}>
            <CreditCard size={24} />
          </div>
          <div className="text-left">
            <p className={`font-black uppercase text-xs tracking-widest ${selected === 'ONLINE' ? 'text-white/80' : 'text-gray-400'}`}>Pay Via Card</p>
            <p className={`font-bold ${selected === 'ONLINE' ? 'text-white' : 'text-gray-900'}`}>Secure Transaction</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('CASH')}
          className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 ${selected === 'CASH'
            ? 'border-blue-600 bg-blue-600 shadow-xl shadow-blue-600/20 scale-[1.02] text-white'
            : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'
            }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selected === 'CASH' ? 'bg-white/20 text-white' : 'bg-white text-gray-400'
            }`}>
            <Truck size={24} />
          </div>
          <div className="text-left">
            <p className={`font-black uppercase text-xs tracking-widest ${selected === 'CASH' ? 'text-white/80' : 'text-gray-400'}`}>Pay at Office</p>
            <p className={`font-bold ${selected === 'CASH' ? 'text-white' : 'text-gray-900'}`}>Cash on Collection</p>
          </div>
        </button>
      </div>
    </div>
  );
}
