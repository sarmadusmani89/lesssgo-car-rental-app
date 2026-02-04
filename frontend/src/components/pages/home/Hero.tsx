"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, ChevronDown, Search, Loader2 } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Hero() {
    const router = useRouter(); // Initialize useRouter
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selections, setSelections] = useState({
        brand: '',
        category: '',
        transmission: ''
    });

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleSelect = (key: string, value: string) => {
        setSelections((prev: any) => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const handleSearch = () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (selections.brand) params.set('brand', selections.brand);
        if (selections.category) params.set('type', selections.category);
        if (selections.transmission) params.set('transmission', selections.transmission);

        router.push(`/cars?${params.toString()}`);
    };

    const dropdownOptions = {
        brand: ['Porsche', 'Ferrari', 'Lamborghini', 'Mercedes-AMG', 'BMW M', 'Audi RS'],
        category: ['Supercar', 'Sports Car', 'Luxury Sedan', 'SUV', 'Convertible'],
        transmission: ['Automatic', 'Manual']
    };

    return (
        <section className={styles.hero}>
            <div className={styles.heroBackground}>
                <Image
                    src="/images/hero_bg.png"
                    alt="Luxury Car Background"
                    fill
                    priority
                    quality={100}
                />
                <div className={styles.heroOverlay} />
            </div>
            <div className="container">
                <div className={styles.heroContent}>
                    <div className={`${styles.heroText} animate-fade-in`}>
                        <h1>
                            Elevate Your <br />
                            <span className="gradient-text">Journey</span>
                        </h1>
                        <p>
                            Experience the thrill of driving the world's most exclusive
                            supercars. Curated for the discerning few.
                        </p>

                        <div className={styles.heroActions}>
                            <Link href="/cars" className="btn btn-primary btn-lg">
                                Browse Cars <ArrowRight size={20} />
                            </Link>
                            <div className={styles.playButtonWrapper}>
                                <button className={styles.playButton}>
                                    <Play size={20} fill="currentColor" />
                                </button>
                                <span>Watch Film</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.filterWidget} glass animate-slide-up`}>
                        <h2 className={styles.widgetTitle}>Find Your Drive</h2>

                        <div className={styles.searchInputs}>
                            {/* Brand Selection */}
                            <div className={styles.inputGroup}>
                                <label>Brand</label>
                                <div
                                    className={`${styles.selectWrapper} ${activeDropdown === 'brand' ? styles.active : ''}`}
                                    onClick={() => toggleDropdown('brand')}
                                >
                                    <span>{selections.brand || 'All Brands'}</span>
                                    <ChevronDown size={16} />

                                    {activeDropdown === 'brand' && (
                                        <div className={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                                            <div className={styles.dropdownItem} onClick={() => handleSelect('brand', '')}>All Brands</div>
                                            {dropdownOptions.brand.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`${styles.dropdownItem} ${selections.brand === opt ? styles.selected : ''}`}
                                                    onClick={() => handleSelect('brand', opt)}
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
                                            {dropdownOptions.category.map(opt => (
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
                                            {dropdownOptions.transmission.map(opt => (
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
                </div>
            </div>
        </section>
    );
}
