"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search, Loader2, MapPin } from 'lucide-react';
import styles from '@/app/(public)/(home)/page.module.css';
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
        <div className={`${styles.filterWidget} glass animate-slide-up`}>
            <h2 className={styles.widgetTitle}>Find Your Drive</h2>
            <div className={styles.searchInputs}>
                {/* Pickup Location Selection */}
                <div className={styles.inputGroup}>
                    <label className="flex items-center gap-1"><MapPin size={10} className="text-blue-600" /> Pickup Location</label>
                    <div
                        className={`${styles.selectWrapper} ${activeDropdown === 'pickup' ? styles.active : ''}`}
                        onClick={() => toggleDropdown('pickup')}
                    >
                        <span>{selections.pickup || 'Select Pickup'}</span>
                        <ChevronDown size={16} />
                        {activeDropdown === 'pickup' && (
                            <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.dropdownItem} onClick={() => handleSelect('pickup', '')}>Select Pickup</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`${styles.dropdownItem} ${selections.pickup === opt ? styles.selected : ''}`}
                                        onClick={() => handleSelect('pickup', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Return Location Selection */}
                <div className={styles.inputGroup}>
                    <label className="flex items-center gap-1"><MapPin size={10} className="text-red-500" /> Return Location</label>
                    <div
                        className={`${styles.selectWrapper} ${activeDropdown === 'return' ? styles.active : ''}`}
                        onClick={() => toggleDropdown('return')}
                    >
                        <span>{selections.return || 'Select Return'}</span>
                        <ChevronDown size={16} />
                        {activeDropdown === 'return' && (
                            <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.dropdownItem} onClick={() => handleSelect('return', '')}>Select Return</div>
                                {dropdownOptions.locations.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`${styles.dropdownItem} ${selections.return === opt ? styles.selected : ''}`}
                                        onClick={() => handleSelect('return', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Category Selection */}
                <div className={styles.inputGroup}>
                    <label>Category</label>
                    <div
                        className={`${styles.selectWrapper} ${activeDropdown === 'category' ? styles.active : ''}`}
                        onClick={() => toggleDropdown('category')}
                    >
                        <span>{selections.category || 'Any Category'}</span>
                        <ChevronDown size={16} />
                        {activeDropdown === 'category' && (
                            <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.dropdownItem} onClick={() => handleSelect('category', '')}>Any Category</div>
                                {dropdownOptions.category.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`${styles.dropdownItem} ${selections.category === opt ? styles.selected : ''}`}
                                        onClick={() => handleSelect('category', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Transmission Selection */}
                <div className={styles.inputGroup}>
                    <label>Transmission</label>
                    <div
                        className={`${styles.selectWrapper} ${activeDropdown === 'transmission' ? styles.active : ''}`}
                        onClick={() => toggleDropdown('transmission')}
                    >
                        <span>{selections.transmission || 'Any'}</span>
                        <ChevronDown size={16} />
                        {activeDropdown === 'transmission' && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.dropdownItem} onClick={() => handleSelect('transmission', '')}>Any</div>
                                {dropdownOptions.transmission.map((opt: string) => (
                                    <div
                                        key={opt}
                                        className={`${styles.dropdownItem} ${selections.transmission === opt ? styles.selected : ''}`}
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
                    className={styles.searchButton}
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
