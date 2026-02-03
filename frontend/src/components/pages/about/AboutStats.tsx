import styles from '@/app/(public)/about/about.module.css';

export default function AboutStats() {
    const stats = [
        { value: '10,000+', label: 'Happy Customers' },
        { value: '500+', label: 'Premium Cars' },
        { value: '50+', label: 'Locations' },
        { value: '99%', label: 'Satisfaction Rate' },
    ];

    return (
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
    );
}
