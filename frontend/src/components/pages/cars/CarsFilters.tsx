'use client';

import { X, Check, MapPin } from 'lucide-react';
import { PREDEFINED_LOCATIONS } from '@/constants/locations';

import { VEHICLE_BRANDS, VEHICLE_CATEGORIES, VEHICLE_TRANSMISSIONS, VEHICLE_CLASSES, VEHICLE_FUEL_TYPES } from '@/constants/car';

interface FilterState {
    brand: string;
    type: string;
    transmission: string;
    priceRange: string;
    pickup: string;
    return: string;
    vehicleClass: string;
    fuelType: string;
}

interface CarsFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export default function CarsFilters({ filters, onChange }: CarsFiltersProps) {
    const brands = VEHICLE_BRANDS;
    const types = VEHICLE_CATEGORIES;
    const transmissions = VEHICLE_TRANSMISSIONS;
    const vehicleClasses = VEHICLE_CLASSES;
    const fuelTypes = VEHICLE_FUEL_TYPES;
    const locations = PREDEFINED_LOCATIONS;
    const prices = [
        { label: 'Under $500', value: '0-500' },
        { label: '$500 - $1,000', value: '500-1000' },
        { label: '$1,000 - $2,000', value: '1000-2000' },
        { label: '$2,000+', value: '2000-99999' }
    ];

    const updateFilter = (key: keyof FilterState, value: string) => {
        onChange({ ...filters, [key]: filters[key] === value ? '' : value });
    };

    const clearFilters = () => {
        onChange({
            brand: '',
            type: '',
            transmission: '',
            priceRange: '',
            pickup: '',
            return: '',
            vehicleClass: '',
            fuelType: ''
        });
    };

    const isFiltered = filters.brand || filters.type || filters.transmission || filters.priceRange || filters.pickup || filters.return || filters.vehicleClass || filters.fuelType;

    const FilterGroup = ({ title, options, activeValue, onSelect, valueKey = (opt: string) => opt }: any) => (
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h4>
            <div className="flex flex-wrap gap-2">
                {options.map((opt: any) => {
                    const label = typeof opt === 'string' ? opt : opt.label;
                    const value = valueKey(opt);
                    const isActive = activeValue === value;
                    return (
                        <button
                            key={value}
                            onClick={() => onSelect(value)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isActive
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <aside className="space-y-10 lg:sticky lg:top-28 h-fit">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black font-outfit uppercase tracking-tight">Filters</h3>
                {isFiltered && (
                    <button
                        onClick={clearFilters}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        <X size={12} /> Clear
                    </button>
                )}
            </div>

            <FilterGroup
                title="Brands"
                options={brands}
                activeValue={filters.brand}
                onSelect={(val: string) => updateFilter('brand', val)}
            />

            <FilterGroup
                title="Category"
                options={types}
                activeValue={filters.type}
                onSelect={(val: string) => updateFilter('type', val)}
            />

            <FilterGroup
                title="Transmission"
                options={transmissions}
                activeValue={filters.transmission}
                onSelect={(val: string) => updateFilter('transmission', val)}
            />

            <FilterGroup
                title="Vehicle Class"
                options={vehicleClasses}
                activeValue={filters.vehicleClass}
                onSelect={(val: string) => updateFilter('vehicleClass', val)}
            />

            <FilterGroup
                title="Fuel Type"
                options={fuelTypes}
                activeValue={filters.fuelType}
                onSelect={(val: string) => updateFilter('fuelType', val)}
            />

            <FilterGroup
                title="Daily Rate"
                options={prices}
                activeValue={filters.priceRange}
                onSelect={(val: string) => updateFilter('priceRange', val)}
                valueKey={(opt: any) => opt.value}
            />

            <FilterGroup
                title="Pickup Location"
                options={locations}
                activeValue={filters.pickup}
                onSelect={(val: string) => updateFilter('pickup', val)}
            />

            <FilterGroup
                title="Return Location"
                options={locations}
                activeValue={filters.return}
                onSelect={(val: string) => updateFilter('return', val)}
            />

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Member Perk</p>
                    <h4 className="text-lg font-black font-outfit mb-3 leading-tight uppercase">Save with Multi-Day Bookings</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                        Unlock up to 20% discount when you reserve for 3 days or more.
                    </p>
                </div>
            </div>
        </aside>
    );
}
