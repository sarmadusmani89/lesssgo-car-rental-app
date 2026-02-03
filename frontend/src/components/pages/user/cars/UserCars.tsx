'use client';

import React from 'react';
import { Car, Search, Filter } from 'lucide-react';

export default function UserCars() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 italic">Browse Cars</h1>
                    <p className="text-slate-500 mt-1">Explore our premium fleet and find your perfect match.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center">
                            <Car size={48} className="text-slate-300" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900">Car Model {i}</h3>
                            <p className="text-blue-600 font-bold mt-2">$99/day</p>
                            <button className="w-full mt-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">Rent Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
