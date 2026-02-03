import { Search, Calendar, Car, Sparkles } from 'lucide-react';
import styles from '@/app/(public)/how-it-works/how-it-works.module.css';

export default function HowItWorksSteps() {
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
            icon: Sparkles,
            title: 'Drive Away',
            description: 'Pick up your car at the scheduled time. Enjoy your journey with 24/7 roadside assistance included.',
        },
    ];

    return (
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
    );
}
