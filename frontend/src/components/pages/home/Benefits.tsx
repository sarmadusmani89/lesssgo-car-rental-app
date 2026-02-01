import { Shield, Star, Zap, MapPin, Calendar, Headphones } from 'lucide-react';
import styles from '../../../app/(public)/(home)/page.module.css';

import BenefitCard from './BenefitCard';

const features = [
    {
        icon: Shield,
        title: "Pristine Condition",
        description: "Meticulously maintained and sanitized vehicles ensuring a showroom experience every time."
    },
    {
        icon: Star,
        title: "Exclusive Cars",
        description: "A curated selection of the latest models from Ferrari, Lamborghini, Porsche, and more."
    },
    {
        icon: Zap,
        title: "Seamless Booking",
        description: "Digital verification and instant confirmation. Get on the road in minutes, not hours."
    },
    {
        icon: MapPin,
        title: "White-Glove Delivery",
        description: "We deliver and pick up your vehicle at your home, hotel, or private airport terminal."
    },
    {
        icon: Calendar,
        title: "Flexible Cancellation",
        description: "Change of plans? Enjoy free cancellation up to 48 hours before your reservation begins."
    },
    {
        icon: Headphones,
        title: "24/7 VIP Support",
        description: "Dedicated concierge team available around the clock to assist with your journey."
    }
];

export default function Benefits() {
    return (
        <section className={styles.benefitsSection}>
            <div className="container">
                <div className={styles.sectionHeaderCentered}>
                    <h2 className={styles.sectionTitle}>Why Choose LessGo</h2>
                    <p className={styles.sectionSubtitle}>Experience automotive excellence with our uncompromising standards and world-class service.</p>
                </div>

                <div className={styles.benefitsGrid}>
                    {features.map((feature, index) => (
                        <BenefitCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
