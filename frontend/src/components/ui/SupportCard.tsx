'use client';

import React from 'react';
import Link from 'next/link';

interface SupportCardProps {
    className?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    variant?: 'dark' | 'primary';
}

const SupportCard: React.FC<SupportCardProps> = ({
    className = '',
    title = 'Need Support?',
    description = 'Our dedicated specialist team is available 24/7 to personalize your legendary driving experience.',
    buttonText = 'Contact Support',
    buttonLink = '/contact',
    variant = 'dark'
}) => {
    const bgClass = variant === 'dark' ? 'bg-gray-900 text-white' : 'bg-primary text-primary-foreground';
    const decoClass = variant === 'dark' ? 'bg-primary/20' : 'bg-white/10';
    const subtextClass = variant === 'dark' ? 'text-primary-foreground/60' : 'text-primary-foreground/60';
    const descriptionClass = variant === 'dark' ? 'text-gray-400' : 'text-primary-foreground/80';

    return (
        <div className={`p-10 rounded-[3rem] shadow-2xl overflow-hidden relative group ${bgClass} ${className}`}>
            {/* Theme-Aware Background Decoration */}
            <div className={`absolute bottom-0 right-0 w-48 h-48 rounded-full -mr-24 -mb-24 transition-transform duration-700 group-hover:scale-150 ${decoClass}`} />
            
            <div className="relative z-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${subtextClass}`}>Concierge Service</p>
                <h4 className="text-2xl font-black font-outfit mb-4 uppercase tracking-tight">{title}</h4>
                <p className={`text-sm font-medium leading-relaxed mb-8 max-w-sm ${descriptionClass}`}>
                    {description}
                </p>
                <Link 
                    href={buttonLink} 
                    className="inline-block w-full text-center py-5 px-4 bg-white text-gray-900 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-black/10"
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};

export default SupportCard;
