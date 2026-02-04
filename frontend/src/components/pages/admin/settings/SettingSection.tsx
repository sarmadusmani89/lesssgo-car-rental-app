'use client';

import React from 'react';
import SettingCard from './SettingCard';

interface SettingItem {
    title: string;
    desc: string;
    icon: React.ElementType;
    onClick?: () => void;
}

interface SettingSectionProps {
    heading: string;
    subHeading: string;
    items: SettingItem[];
}

export default function SettingSection({
    heading,
    subHeading,
    items,
}: SettingSectionProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 italic">
                    {heading}
                </h1>
                <p className="text-slate-500 mt-1">{subHeading}</p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-6">
                {items.map((item, index) => (
                    <SettingCard
                        key={index}
                        title={item.title}
                        desc={item.desc}
                        icon={item.icon}
                        onClick={item.onClick}
                    />
                ))}
            </div>
        </div>
    );
}
