import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';
import CarCard from '../../ui/CarCard';

export default function FeaturedCars() {
    const featuredCars = [
        {
            id: 1,
            brand: 'MERCEDES-BENZ',
            name: 'AMG GT',
            price: '1,200',
            monthly: '8,000',
            image: '/images/amg_gt_card_hero.png',
            badge: 'New Arrival',
            badgeClass: styles.badgeNew,
            hp: '577 HP',
            fuel: 'Petrol',
            transmission: 'Auto',
        },
        {
            id: 2,
            brand: 'PORSCHE',
            name: '911 Turbo S',
            price: '1,800',
            monthly: '12,500',
            image: '/images/porsche_911_light_studio.png',
            badge: 'Featured',
            badgeClass: styles.badgeFeatured,
            hp: '640 HP',
            fuel: 'Petrol',
            transmission: 'PDK',
        },
        {
            id: 3,
            brand: 'BMW',
            name: 'M8 Competition',
            price: '1,100',
            monthly: '7,800',
            image: '/images/bmw_m8_light_studio.png',
            badge: 'Popular',
            badgeClass: styles.badgePopular,
            hp: '617 HP',
            fuel: 'Petrol',
            transmission: 'Auto',
        },
        {
            id: 4,
            brand: 'AUDI',
            name: 'RS e-tron GT',
            price: '950',
            monthly: '6,900',
            image: '/images/electric_sedan_card.png',
            badge: 'Electric',
            badgeClass: styles.badgeNew,
            hp: '637 HP',
            fuel: 'Electric',
            transmission: 'Auto',
        },
        {
            id: 5,
            brand: 'LAMBORGHINI',
            name: 'Urus',
            price: '2,500',
            monthly: '18,000',
            image: '/images/luxury_suv_card.png',
            badge: 'SUV',
            badgeClass: styles.badgeFeatured,
            hp: '657 HP',
            fuel: 'Petrol',
            transmission: 'Auto',
        },
        {
            id: 6,
            brand: 'FERRARI',
            name: 'Roma',
            price: '2,200',
            monthly: '16,500',
            image: '/images/sport_car_card.png',
            badge: 'Sport',
            badgeClass: styles.badgePopular,
            hp: '612 HP',
            fuel: 'Petrol',
            transmission: 'F1',
        },
    ];

    return (
        <section className={styles.carsSection}>
            <div className="container">
                <div className={styles.sectionHeaderCentered}>
                    <h2 className={styles.sectionTitle}>Featured Cars</h2>
                    <p className={styles.sectionSubtitle}>Discover our hand-picked selection of high-performance cars.</p>
                </div>

                <div className={styles.carGrid}>
                    {featuredCars.map((car) => (
                        <CarCard key={car.id} {...car} />
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                    <Link href="/cars" className="btn btn-outline btn-lg">
                        View All Cars <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
