'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PaymentStatusHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    variant: 'success' | 'failed' | 'declined' | 'error';
    iconRotate?: string;
}

export default function PaymentStatusHeader({ 
    icon: Icon, 
    title, 
    subtitle, 
    variant,
    iconRotate = ''
}: PaymentStatusHeaderProps) {
    const variants = {
        success: {
            bg: 'bg-blue-600',
            iconBg: 'bg-white',
            iconText: 'text-blue-600',
            shadow: 'shadow-blue-900/20',
            subtitleText: 'text-blue-100',
            titleHighlight: 'text-white'
        },
        failed: {
            bg: 'bg-red-600',
            iconBg: 'bg-white',
            iconText: 'text-red-600',
            shadow: 'shadow-red-900/20',
            subtitleText: 'text-red-100',
            titleHighlight: 'text-white'
        },
        declined: {
            bg: 'bg-amber-500',
            iconBg: 'bg-white',
            iconText: 'text-amber-500',
            shadow: 'shadow-amber-900/20',
            subtitleText: 'text-amber-100',
            titleHighlight: 'text-white'
        },
        error: {
            bg: 'bg-gray-900',
            iconBg: 'bg-white',
            iconText: 'text-gray-900',
            shadow: 'shadow-black/20',
            subtitleText: 'text-gray-400',
            titleHighlight: 'text-white'
        }
    };

    const config = variants[variant];
    const mainTitle = title.split(' ')[0];
    const highlightTitle = title.split(' ').slice(1).join(' ');

    return (
        <div className={`${config.bg} p-12 text-center text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className={`absolute bottom-0 left-0 w-48 h-48 ${variant === 'error' ? 'bg-white/5' : 'bg-black/10'} rounded-full -ml-24 -mb-24`} />

            <div className="relative z-10 flex flex-col items-center">
                <div className={`w-24 h-24 ${config.iconBg} rounded-3xl flex items-center justify-center ${config.iconText} mb-8 shadow-2xl ${config.shadow} ${iconRotate} transition-transform hover:rotate-0 duration-500`}>
                    <Icon size={48} strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-4 leading-none">
                    {mainTitle} <span className={`opacity-60 ${config.titleHighlight}`}>{highlightTitle}</span>
                </h1>
                <p className={`${config.subtitleText} font-bold uppercase tracking-[0.2em] text-[10px]`}>{subtitle}</p>
            </div>
        </div>
    );
}
