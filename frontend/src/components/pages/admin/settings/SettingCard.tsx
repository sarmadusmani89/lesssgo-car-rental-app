'use client';

import React from 'react';

interface SettingCardProps {
    title: string;
    desc: string;
    icon: React.ElementType;
    onClick?: () => void;
}

export default function SettingCard({ title, desc, icon: Icon, onClick }: SettingCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer"
        >
            <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300">
                    <Icon size={24} className="group-hover:scale-110 transition-transform" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium  ">
                        {desc}
                    </p>
                </div>
            </div>

            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm group-hover:border-primary/20 group-hover:text-primary">
                Configure
            </button>
        </div>
    );
}
