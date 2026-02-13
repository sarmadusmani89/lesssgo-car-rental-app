"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, Loader2, MapPin } from 'lucide-react';
import { PREDEFINED_LOCATIONS } from '@/constants/locations';
import { VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS } from '@/constants/car';

export default function HeroFilter() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selections, setSelections] = useState({
        category: '',
        transmission: '',
        pickup: '',
        return: ''
    });

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleSelect = (key: string, value: string) => {
        setSelections((prev) => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const handleSearch = () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selections.category) params.set('type', selections.category);
        if (selections.transmission) params.set('transmission', selections.transmission);
        if (selections.pickup) params.set('pickup', selections.pickup);
        if (selections.return) params.set('return', selections.return);

        router.push(`/cars?${params.toString()}`);
    };

    const dropdownOptions = {
        category: VEHICLE_CATEGORIES,
        transmission: VEHICLE_TRANSMISSIONS,
        locations: PREDEFINED_LOCATIONS
    };

    return (
        <div className="w-full lg:w-[40%] max-w-full lg:max-w-[600px] p-8 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/5 bg-white/70 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-extrabold mb-6 text-slate-900 tracking-tight">Find Your Drive</h2>
            <div className="flex flex-col gap-4">
                {/* Pickup Location Selection */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500"><MapPin size={10} className="text-blue-600" /> Pickup Location</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'pickup' ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}`}
                        onClick={() => toggleDropdown('pickup')}
                    >
                        <span className="font-semibold text-slate-900 text-sm">{selections.pickup || 'Select Pickup'}</span>
                        <ChevronDown size={16} className="text-blue-600" />
                        {activeDropdown === 'pickup' && (
                            <div className="absolute top-[110%] left-0 w-full bg-white border border-black/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6" onClick={() => handleSelect('pickup', '')}>Select Pickup</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6 ${selections.pickup === opt ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'}`}
                                        onClick={() => handleSelect('pickup', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-[1px] bg-black/5 my-1" />

                {/* Return Location Selection */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500"><MapPin size={10} className="text-red-500" /> Return Location</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'return' ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}`}
                        onClick={() => toggleDropdown('return')}
                    >
                        <span className="font-semibold text-slate-900 text-sm">{selections.return || 'Select Return'}</span>
                        <ChevronDown size={16} className="text-blue-600" />
                        {activeDropdown === 'return' && (
                            <div className="absolute top-[110%] left-0 w-full bg-white border border-black/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6" onClick={() => handleSelect('return', '')}>Select Return</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6 ${selections.return === opt ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'}`}
                                        onClick={() => handleSelect('return', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-[1px] bg-black/5 my-1" />

                {/* Category Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'category' ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}`}
                        onClick={() => toggleDropdown('category')}
                    >
                        <span className="font-semibold text-slate-900 text-sm">{selections.category || 'Any Category'}</span>
                        <ChevronDown size={16} className="text-blue-600" />
                        {activeDropdown === 'category' && (
                            <div className="absolute top-[110%] left-0 w-full bg-white border border-black/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6" onClick={() => handleSelect('category', '')}>Any Category</div>
                                {dropdownOptions.category.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6 ${selections.category === opt ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'}`}
                                        onClick={() => handleSelect('category', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-[1px] bg-black/5 my-1" />

                {/* Transmission Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Transmission</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'transmission' ? 'ring-2 ring-blue-500/20 border-blue-500/50' : ''}`}
                        onClick={() => toggleDropdown('transmission')}
                    >
                        <span className="font-semibold text-slate-900 text-sm">{selections.transmission || 'Any'}</span>
                        <ChevronDown size={16} className="text-blue-600" />
                        {activeDropdown === 'transmission' && (
                            <div className="absolute top-[110%] left-0 w-full bg-white border border-black/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-[14px_20px] text-[15px] text-slate-500 font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6" onClick={() => handleSelect('transmission', '')}>Any</div>
                                {dropdownOptions.transmission.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:text-blue-600 hover:pl-6 ${selections.transmission === opt ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect('transmission', opt);
                                        }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="mt-3 bg-blue-600 text-white flex items-center justify-center gap-2 p-[14px] rounded-xl font-extrabold uppercase tracking-wider text-[13px] transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.15)] hover:translate-y-[-2px] hover:shadow-[0_15px_30px_rgba(37,99,235,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <Search size={20} />
                    )}
                    <span>{isLoading ? 'Searching...' : 'Search Fleet'}</span>
                </button>
            </div>
        </div>
    );
}
