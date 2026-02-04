"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, ChevronDown, Search } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Hero() {
    const router = useRouter(); // Initialize useRouter
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selections, setSelections] = useState({
        brand: '',
        category: '',
        price: '',
        pickupDate: '',
        returnDate: ''
    });

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleSelect = (key: string, value: string) => {
        setSelections((prev: typeof selections) => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selections.brand) params.set('brand', selections.brand);
        if (selections.category) params.set('type', selections.category);
        if (selections.pickupDate) params.set('startDate', selections.pickupDate);
        if (selections.returnDate) params.set('endDate', selections.returnDate);
        router.push(`/cars?${params.toString()}`);
    };

    const dropdownOptions = {
        brand: ['Porsche', 'Ferrari', 'Lamborghini', 'Mercedes-AMG', 'BMW M', 'Audi RS'],
        category: ['Supercar', 'Sports Car', 'Luxury Sedan', 'SUV', 'Convertible'],
        price: ['$500 - $1,000/day', '$1,000 - $2,000/day', '$2,000+/day']
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
                            Elevate Your's <br />
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
                            {/* Dates Selection */}
                            <div className={styles.inputGroup}>
                                <label>Pickup Date</label>
                                <input
                                    type="date"
                                    className="bg-transparent border-none outline-none text-white text-sm"
                                    value={selections.pickupDate}
                                    onChange={(e) => setSelections({ ...selections, pickupDate: e.target.value })}
                                />
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.inputGroup}>
                                <label>Return Date</label>
                                <input
                                    type="date"
                                    className="bg-transparent border-none outline-none text-white text-sm"
                                    value={selections.returnDate}
                                    onChange={(e) => setSelections({ ...selections, returnDate: e.target.value })}
                                />
                            </div>

                            <div className={styles.divider} />

                            {/* Brand Selection (Simplified for room) */}
                            <div className={styles.inputGroup}>
                                <label>Brand</label>
                                <div
                                    className={`${styles.selectWrapper} ${activeDropdown === 'brand' ? styles.active : ''}`}
                                    onClick={() => toggleDropdown('brand')}
                                >
                                    <span>{selections.brand || 'All Brands'}</span>
                                    <ChevronDown size={16} />

                                    {activeDropdown === 'brand' && (
                                        <div className={styles.dropdownMenu}>
                                            <div className={styles.dropdownItem} onClick={() => handleSelect('brand', '')}>All Brands</div>
                                            {dropdownOptions.brand.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`${styles.dropdownItem} ${selections.brand === opt ? styles.selected : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelect('brand', opt);
                                                    }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button onClick={handleSearch} className={styles.searchButton}>
                                <Search size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
