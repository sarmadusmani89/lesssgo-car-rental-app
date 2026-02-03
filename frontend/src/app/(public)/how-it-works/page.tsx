import Link from 'next/link';
import { Search, Calendar, Car, CheckCircle } from 'lucide-react';
import styles from './how-it-works.module.css';

export default function HowItWorksPage() {
    const steps = [
        {
            icon: Search,
            title: 'Browse Our Fleet',
            description: 'Explore our wide selection of premium cars. Filter by type, price, or features to find your perfect ride.',
        },
        {
            icon: Calendar,
            title: 'Select Dates',
            description: 'Choose your pickup and return dates. View real-time availability and transparent pricing with no hidden fees.',
        },
        {
            icon: Car,
            title: 'Book & Confirm',
            description: 'Complete your booking with our secure payment system. Receive instant confirmation and digital documents.',
        },
        {
            icon: CheckCircle,
            title: 'Drive Away',
            description: 'Pick up your car at the scheduled time. Enjoy your journey with 24/7 roadside assistance included.',
        },
    ];

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.title}>How It Works</h1>
                    <p className={styles.subtitle}>
                        Renting a car with Lesssgo is simple, fast, and hassle-free.
                        Follow these easy steps to get on the road in no time.
                    </p>
                </div>
            </section>

            <section className={styles.steps}>
                <div className="container">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className={styles.step}>
                                <div className={styles.stepNumber}>{index + 1}</div>
                                <div className={styles.stepIcon}>
                                    <Icon size={32} />
                                </div>
                                <div className={styles.stepContent}>
                                    <h3>{step.title}</h3>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className={styles.cta}>
                <div className="container">
                    <h2>Ready to Get Started?</h2>
                    <p>Browse our fleet and find your perfect car today</p>
                    <Link href="/cars" className="btn btn-primary btn-lg">
                        View All Cars
                    </Link>
                </div>
            </section>
        </div>
    );
}
