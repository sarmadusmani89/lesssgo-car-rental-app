'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdviceItem {
    icon: LucideIcon;
    label: string;
    text: string;
}

interface PaymentAdviceProps {
    adviceItems: AdviceItem[];
    contextTitle: string;
    contextText: string;
    contextIcon: LucideIcon;
    variant: 'failed' | 'declined' | 'error';
    orderId?: string | null;
}

export default function PaymentAdvice({
    adviceItems,
    contextTitle,
    contextText,
    contextIcon: ContextIcon,
    variant,
    orderId
}: PaymentAdviceProps) {
    const variants = {
        failed: {
            bg: 'bg-red-50',
            border: 'border-red-100',
            iconText: 'text-red-600',
            label: 'text-red-400',
            orderText: 'text-red-600'
        },
        declined: {
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            iconText: 'text-amber-600',
            label: 'text-amber-400',
            orderText: 'text-amber-600'
        },
        error: {
            bg: 'bg-gray-50',
            border: 'border-gray-100',
            iconText: 'text-blue-600',
            label: 'text-gray-400',
            orderText: 'text-gray-900'
        }
    };

    const config = variants[variant];

    return (
        <div className="space-y-10">
            {/* Context Section */}
            <div className={`${config.bg} rounded-3xl p-8 border ${config.border} space-y-4`}>
                <div className={`flex items-center gap-3 ${config.iconText}`}>
                    <ContextIcon size={20} />
                    <span className="font-black uppercase text-xs tracking-widest">{contextTitle}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium leading-relaxed">
                    {contextText}
                </p>
                {orderId && (
                    <div className={`pt-4 border-t ${config.border} flex items-center justify-between`}>
                        <span className={`text-[10px] font-black ${config.label} uppercase tracking-widest`}>Reference</span>
                        <span className={`text-xs font-mono font-bold ${config.orderText}`}>#{orderId}</span>
                    </div>
                )}
            </div>

            {/* Advice Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adviceItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400">
                                <Icon size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{item.label}</span>
                                <p className="text-xs font-bold text-gray-600">{item.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
