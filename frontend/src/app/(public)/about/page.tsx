import { Target, Heart, Shield, Users } from 'lucide-react';
import styles from './about.module.css';

export default function AboutPage() {
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

    const stats = [
        { value: '10,000+', label: 'Happy Customers' },
        { value: '500+', label: 'Premium Cars' },
        { value: '50+', label: 'Locations' },
        { value: '99%', label: 'Satisfaction Rate' },
    ];

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>About Lesssgo</h1>
                    <p className={styles.subtitle}>
                        Your trusted partner in premium car rentals. We're dedicated to making every journey memorable.
                    </p>
                </div>
            </section>

            <section className={styles.story}>
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyContent}>
                            <h2>Our Story</h2>
                            <p>
                                Founded with a vision to revolutionize the car rental industry, Lesssgo has grown from a small local service to a trusted name in premium car rentals.
                            </p>
                            <p>
                                We believe that renting a car should be simple, transparent, and enjoyable. That's why we've built a platform that combines cutting-edge technology with personalized service to deliver an unmatched rental experience.
                            </p>
                            <p>
                                Today, we proudly serve thousands of satisfied customers, offering a diverse fleet of well-maintained cars and exceptional customer support every step of the way.
                            </p>
                        </div>
                        <div className={styles.storyImage}>
                            <div className={styles.imagePlaceholder}>
                                <Users size={64} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.stats}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        {stats.map((stat, index) => (
                            <div key={index} className={styles.statCard}>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
        </div>
    );
}
