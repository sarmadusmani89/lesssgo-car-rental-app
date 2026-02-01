"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, ChevronDown, Search } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';

export default function Hero() {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [selections, setSelections] = useState({
        brand: '',
        category: '',
        price: ''
    });

    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };

    const handleSelect = (key: string, value: string) => {
        setSelections((prev: typeof selections) => ({ ...prev, [key]: value }));
        setActiveDropdown(null);
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
                            {/* Brand Selection */}
                            <div className={styles.inputGroup}>
                                <label>Brand</label>
                                <div
                                    className={`${styles.selectWrapper} ${activeDropdown === 'brand' ? styles.active : ''}`}
                                    onClick={() => toggleDropdown('brand')}
                                >
                                    <span>{selections.brand || 'Select Brand'}</span>
                                    <ChevronDown size={16} />

                                    {activeDropdown === 'brand' && (
                                        <div className={styles.dropdownMenu}>
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

                            <div className={styles.divider} />

                            {/* Category Selection */}
                            <div className={styles.inputGroup}>
                                <label>Category</label>
                                <div
                                    className={`${styles.selectWrapper} ${activeDropdown === 'category' ? styles.active : ''}`}
                                    onClick={() => toggleDropdown('category')}
                                >
                                    <span>{selections.category || 'Select Category'}</span>
                                    <ChevronDown size={16} />

                                    {activeDropdown === 'category' && (
                                        <div className={styles.dropdownMenu}>
                                            {dropdownOptions.category.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`${styles.dropdownItem} ${selections.category === opt ? styles.selected : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelect('category', opt);
                                                    }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.divider} />

                            {/* Price Selection */}
                            <div className={styles.inputGroup}>
                                <label>Price</label>
                                <div
                                    className={`${styles.selectWrapper} ${activeDropdown === 'price' ? styles.active : ''}`}
                                    onClick={() => toggleDropdown('price')}
                                >
                                    <span>{selections.price || 'Select Range'}</span>
                                    <ChevronDown size={16} />

                                    {activeDropdown === 'price' && (
                                        <div className={styles.dropdownMenu}>
                                            {dropdownOptions.price.map(opt => (
                                                <div
                                                    key={opt}
                                                    className={`${styles.dropdownItem} ${selections.price === opt ? styles.selected : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelect('price', opt);
                                                    }}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className={styles.searchButton}>
                                <Search size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
