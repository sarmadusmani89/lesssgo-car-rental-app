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
    items: SettingItem[];
}

export default function SettingSection({
    items,
}: SettingSectionProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight  ">
                    System <span className="text-primary">Settings</span>
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage platform configurations, customize appearance, and control system behavior.</p>
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
