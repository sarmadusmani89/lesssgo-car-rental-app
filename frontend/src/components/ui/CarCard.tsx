import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Gauge, Fuel, Cpu } from 'lucide-react';
import styles from '@/app/(public)/(home)/page.module.css';

interface CarProps {
    id: string;
    brand: string;
    name: string;
    price: string;
    monthly: string;
    image: string;
    badge: string;
    badgeClass: string;
    hp: string;
    fuel: string;
    transmission: string;
    type?: string;
}

export default function CarCard(car: CarProps) {
    return (
        <div className={styles.carCard}>
            <div className={styles.cardHead}>
                <div className={`${styles.cardBadge} ${car.badgeClass}`}>
                    {car.badge}
                </div>
                <button className={styles.wishlistBtn}>
                    <Heart size={20} />
                </button>
                <Image src={car.image} alt={car.name} fill />
                <div className={styles.cardHeadOverlay} />
            </div>

            <div className={styles.cardBody}>
                <span className={styles.brandLabel}>{car.brand}</span>
                <h3>{car.name}</h3>

                <div className={styles.carSpecs}>
                    <div className={styles.specItem}>
                        <Gauge size={16} className={styles.specIcon} />
                        {car.hp}
                    </div>
                    <div className={styles.specItem}>
                        <Fuel size={16} className={styles.specIcon} />
                        {car.fuel}
                    </div>
                    <div className={styles.specItem}>
                        <Cpu size={16} className={styles.specIcon} />
                        {car.transmission}
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.priceSection}>
                        <span className={styles.priceLabel}>Daily Rate</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span className={styles.priceMain}>${car.price}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>/ day</span>
                        </div>
                        <span className={styles.priceMonthly}>${car.monthly} / month</span>
                    </div>
                    <Link href={`/car?id=${car.id}`} className={styles.btnDetails}>
                        Details <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
