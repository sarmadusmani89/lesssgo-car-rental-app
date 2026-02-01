'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';
import UserCard from './UserCard';

export default function UserSection() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 italic">
                        User Management
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage user roles, accounts, and system access.
                    </p>
                </div>

                <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                    <UserPlus size={20} />
                    Add User
                </button>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <UserCard key={i} index={i} />
                ))}
            </div>
        </div>
    );
}
