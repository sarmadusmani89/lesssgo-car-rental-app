"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, Loader2, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PREDEFINED_LOCATIONS } from '@/constants/locations';
import { VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS } from '@/constants/car';

export default function HeroFilter() {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<any>(null);
    const [selections, setSelections] = useState({
        category: '',
        transmission: '',
        pickup: '',
        return: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            }
        };
        fetchSettings();
    }, []);

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
        category: settings?.categories || VEHICLE_CATEGORIES,
        transmission: settings?.transmissions || VEHICLE_TRANSMISSIONS,
        locations: settings?.locations || PREDEFINED_LOCATIONS
    };

    return (
        <div className="w-full lg:w-[40%] max-w-full lg:max-w-[600px] p-8 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/5 bg-white/70 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-xl font-extrabold mb-6 text-primary tracking-tight">Find Your Drive</h2>
            <div className="flex flex-col gap-4">
                {/* Pickup Location Selection */}
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><MapPin size={10} className="text-accent" /> Pickup Location</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'pickup' ? 'ring-2 ring-accent/20 border-accent/50' : ''}`}
                        onClick={() => toggleDropdown('pickup')}
                    >
                        <span className="font-semibold text-primary text-sm">{selections.pickup || 'Select Pickup'}</span>
                        <ChevronDown size={16} className="text-accent" />
                        {activeDropdown === 'pickup' && (
                            <div className="absolute top-[110%] left-0 w-full bg-card border border-border rounded-2xl shadow-xl max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-muted-foreground font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5" onClick={() => handleSelect('pickup', '')}>Select Pickup</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5 ${selections.pickup === opt ? 'bg-muted text-primary font-bold' : 'text-muted-foreground'}`}
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
                    <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"><MapPin size={10} className="text-red-500" /> Return Location</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'return' ? 'ring-2 ring-accent/20 border-accent/50' : ''}`}
                        onClick={() => toggleDropdown('return')}
                    >
                        <span className="font-semibold text-primary text-sm">{selections.return || 'Select Return'}</span>
                        <ChevronDown size={16} className="text-accent" />
                        {activeDropdown === 'return' && (
                            <div className="absolute top-[110%] left-0 w-full bg-card border border-border rounded-2xl shadow-xl max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-muted-foreground font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5" onClick={() => handleSelect('return', '')}>Select Return</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5 ${selections.return === opt ? 'bg-muted text-primary font-bold' : 'text-muted-foreground'}`}
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'category' ? 'ring-2 ring-accent/20 border-accent/50' : ''}`}
                        onClick={() => toggleDropdown('category')}
                    >
                        <span className="font-semibold text-primary text-sm">{selections.category || 'Any Category'}</span>
                        <ChevronDown size={16} className="text-accent" />
                        {activeDropdown === 'category' && (
                            <div className="absolute top-[110%] left-0 w-full bg-card border border-border rounded-2xl shadow-xl max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="p-[14px_20px] text-[15px] text-muted-foreground font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5" onClick={() => handleSelect('category', '')}>Any Category</div>
                                {dropdownOptions.category.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5 ${selections.category === opt ? 'bg-muted text-primary font-bold' : 'text-muted-foreground'}`}
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
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Transmission</label>
                    <div
                        className={`relative flex items-center justify-between bg-white/50 border border-black/5 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/80 hover:border-black/10 ${activeDropdown === 'transmission' ? 'ring-2 ring-accent/20 border-accent/50' : ''}`}
                        onClick={() => toggleDropdown('transmission')}
                    >
                        <span className="font-semibold text-primary text-sm">{selections.transmission || 'Any'}</span>
                        <ChevronDown size={16} className="text-accent" />
                        {activeDropdown === 'transmission' && (
                            <div className="absolute top-[110%] left-0 w-full bg-card border border-border rounded-2xl shadow-xl max-h-[280px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-[14px_20px] text-[15px] text-muted-foreground font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5" onClick={() => handleSelect('transmission', '')}>Any</div>
                                {dropdownOptions.transmission.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`p-[14px_20px] text-[15px] font-medium cursor-pointer transition-all duration-200 hover:bg-muted hover:text-primary hover:pl-5 ${selections.transmission === opt ? 'bg-muted text-primary font-bold' : 'text-muted-foreground'}`}
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

                <Button
                    onClick={handleSearch}
                    variant="accent"
                    size="lg"
                    className="mt-3 w-full uppercase tracking-wider text-[13px]"
                    isLoading={isLoading}
                >
                    {!isLoading && <Search size={20} />}
                    {isLoading ? 'Searching...' : 'Search Fleet'}
                </Button>
            </div>
        </div>
    );
}
