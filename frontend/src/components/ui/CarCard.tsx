'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Share2, Heart, Fuel, Gauge, Snowflake, MapPin, Users, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleWishlist } from '@/lib/store/slices/wishlistSlice';
import styles from '@/app/(public)/(home)/page.module.css';

interface CarCardProps {
    id: string;
    slug?: string;
    name: string;
    brand: string;
    price: number;
    monthlyPrice?: number;
    status: string;
    hp: number;
    fuel: string;
    transmission: string;
    image: string;
    // New metadata
    passengers?: number;
    hasAC?: boolean;
    hasGPS?: boolean;
    freeCancellation?: boolean;
}

export default function CarCard({
    id, slug, name, brand, price, monthlyPrice, status, hp, fuel, transmission, image,
    passengers, hasAC, hasGPS, freeCancellation
}: CarCardProps) {
    const currency = useSelector((state: RootState) => state.ui.currency);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const isWishlisted = wishlist.includes(id);
    const dispatch = useDispatch();

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(id));
    };

    const isAvailable = status === 'AVAILABLE';
    const badgeText = isAvailable ? 'Instant Booking' : 'Reserved';

    return (
        <div className={styles.carCard}>
            <div className={styles.cardHead}>
                <div className={`${styles.cardBadge} ${isAvailable ? styles.badgePopular : styles.badgeSlate}`}>
                    {badgeText}
                </div>
                <button
                    className={`${styles.wishlistBtn} ${isWishlisted ? 'text-red-500' : ''}`}
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart size={20} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />
                </button>
                <div className="relative w-full h-full min-h-[200px]">
                    <Image
                        src={image || '/images/cars/placeholder.jpg'}
                        alt={`${brand} ${name}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={false}
                    />
                </div>
                <div className={styles.cardHeadOverlay} />
            </div>

            <div className={styles.cardBody}>
                <span className={styles.brandLabel}>{brand}</span>
                <h3 className="line-clamp-1">{name}</h3>

                <div className={styles.carSpecs}>
                    <div className={styles.specItem}>
                        <Users size={16} className={styles.specIcon} />
                        <span>{passengers || 4} Seats</span>
                    </div>
                    <div className={styles.specItem}>
                        <Fuel size={16} className={styles.specIcon} />
                        <span>{fuel}</span>
                    </div>
                    <div className={styles.specItem}>
                        <Gauge size={16} className={styles.specIcon} />
                        <span>{transmission}</span>
                    </div>
                    {hasAC && (
                        <div className={styles.specItem}>
                            <Snowflake size={16} className={styles.specIcon} />
                            <span>A/C</span>
                        </div>
                    )}
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.priceSection}>
                        <span className={styles.priceLabel}>Daily Rate</span>
                        <div className="flex items-baseline gap-1">
                            <span className={styles.priceMain}>{formatPrice(price, currency, rates)}</span>
                            <span className="text-xs font-bold text-gray-400">/ day</span>
                        </div>
                        {monthlyPrice && (
                            <span className={styles.priceMonthly}>{formatPrice(monthlyPrice, currency, rates)} / month</span>
                        )}

                    </div>
                    <Link href={`/car/${slug || id}`} className={styles.btnDetails}>
                        Details <ArrowRight size={18} />
                    </Link>
                </div>

                {freeCancellation && (
                    <div className="mt-3 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider">
                        Free Cancellation
                    </div>
                )}
            </div>
        </div>
    );
}
