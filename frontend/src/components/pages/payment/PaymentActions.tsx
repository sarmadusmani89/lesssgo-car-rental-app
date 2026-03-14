'use client';

import React from 'react';
import { Home, ArrowLeft, ArrowRight, LucideIcon } from 'lucide-react';

interface PaymentAction {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant: 'primary' | 'secondary' | 'icon';
    colorClass?: string;
}

interface PaymentActionsProps {
    actions: PaymentAction[];
    footerTitle?: string;
    footerSubtitle?: string;
}

export default function PaymentActions({
    actions,
    footerTitle,
    footerSubtitle
}: PaymentActionsProps) {
    return (
        <div className="border-t border-gray-100 pt-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {(footerTitle || footerSubtitle) && (
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <ArrowRight size={24} />
                        </div>
                        <div>
                            {footerTitle && <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">{footerTitle}</h3>}
                            {footerSubtitle && <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">{footerSubtitle}</p>}
                        </div>
                    </div>
                )}
                
                <div className="flex gap-4 w-full md:w-auto">
                    {actions.map((action, idx) => {
                        const Icon = action.icon;
                        
                        if (action.variant === 'primary') {
                            return (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className={`flex-1 md:flex-none px-8 py-5 ${action.colorClass || 'bg-gray-900'} text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3`}
                                >
                                    {Icon && <Icon size={16} />}
                                    {action.label}
                                </button>
                            );
                        }
                        
                        if (action.variant === 'secondary') {
                            return (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="px-8 py-5 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-50 flex items-center justify-center gap-3"
                                >
                                    {Icon && <Icon size={16} />}
                                    <span className="uppercase text-[10px] tracking-widest">{action.label}</span>
                                </button>
                            );
                        }

                        if (action.variant === 'icon') {
                            return (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="p-5 bg-white text-gray-900 rounded-2xl font-black border border-gray-100 hover:bg-gray-50 transition-all shadow-xl shadow-gray-50"
                                >
                                    {Icon && <Icon size={20} />}
                                </button>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
