'use client';

import React from 'react';
import { Mail, Shield, CheckCircle2 } from 'lucide-react';

interface UserCardProps {
    index: number;
}

export default function UserCard({ index }: UserCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-200 transition-colors">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                        {String.fromCharCode(64 + index)}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">
                        User Account {index}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Mail size={12} />
                        user{index}@example.com
                    </div>
                </div>

                <CheckCircle2 size={18} className="text-emerald-500" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                    <Shield size={12} />
                    {index === 1 ? 'Admin' : 'User'}
                </div>

                <button className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors">
                    Edit Profile
                </button>
            </div>
        </div>
    );
}
