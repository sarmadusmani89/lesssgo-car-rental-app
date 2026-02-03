'use client';

import React from 'react';

interface SettingCardProps {
    title: string;
    desc: string;
    icon: React.ElementType;
}

export default function SettingCard({ title, desc, icon: Icon }: SettingCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <Icon size={24} />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 font-medium italic">
                        {desc}
                    </p>
                </div>
            </div>

            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                Configure
            </button>
        </div>
    );
}
