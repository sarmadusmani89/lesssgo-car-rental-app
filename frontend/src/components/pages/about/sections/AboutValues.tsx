"use client";

import { Target, Heart, Shield, Users } from 'lucide-react';
import ValueCard from '../components/ValueCard';

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

export default function AboutValues() {
    return (
        <section className="py-24 md:py-32 bg-slate-50/50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-16 tracking-tight">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {values.map((value, index) => (
                        <ValueCard key={index} {...value} />
                    ))}
                </div>
            </div>
        </section>
    );
}
