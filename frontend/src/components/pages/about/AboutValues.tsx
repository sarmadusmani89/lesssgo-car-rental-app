import styles from '@/app/(public)/about/about.module.css';
import { Target, Heart, Shield, Users } from 'lucide-react';

export default function AboutValues() {
    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To provide premium car rental experiences that exceed expectations, making quality cars accessible to everyone.',
        },
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Every decision we make is centered around delivering exceptional service and building lasting relationships.',
        },
        {
            icon: Shield,
            title: 'Trust & Safety',
            description: 'We maintain the highest standards of car maintenance and safety protocols for your peace of mind.',
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Building a community of drivers who value quality, reliability, and outstanding customer service.',
        },
    ];

    return (
        <section className={styles.values}>
            <div className="container">
                <h2 className={styles.sectionTitle}>Our Values</h2>
                <div className={styles.valuesGrid}>
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className={styles.valueCard}>
                                <div className={styles.valueIcon}>
                                    <Icon size={40} />
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
