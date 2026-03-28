"use client";

import StatCard from '../components/StatCard';

const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Premium Cars' },
    { value: '50+', label: 'Locations' },
    { value: '99%', label: 'Satisfaction Rate' },
];

export default function AboutStats() {
    return (
        <section className="py-20 bg-primary text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
