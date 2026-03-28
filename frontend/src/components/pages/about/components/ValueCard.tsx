"use client";

import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
    return (
        <div className="p-10 bg-white rounded-[1.25rem] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-[#7c3aed] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                <Icon size={40} />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed  ">{description}</p>
        </div>
    );
}
