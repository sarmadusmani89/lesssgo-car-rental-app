'use client';

import React from 'react';
import { Users, Mail, Shield } from 'lucide-react';

export default function UserUsers() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 italic">User Directory</h1>
                <p className="text-slate-500 mt-1">Connect with other members of the Lesssgo community.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            U{i}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">User {i}</h3>
                            <p className="text-xs text-slate-500">Member since 2024</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
