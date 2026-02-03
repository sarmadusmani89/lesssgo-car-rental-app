'use client';

import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function UserProfile() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 italic">Your Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information and contact details.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-50">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        JD
                    </div>
                    <div>
                        <h2 className="text-24 font-bold text-slate-900">John Doe</h2>
                        <p className="text-slate-500 font-medium italic">Platinum Member</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                            <Mail size={18} className="text-blue-500" />
                            <span>john.doe@example.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <Phone size={18} className="text-blue-500" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-600">
                            <MapPin size={18} className="text-blue-500" />
                            <span>New York, USA</span>
                        </div>
                    </div>
                </div>

                <button className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg">Edit Profile</button>
            </div>
        </div>
    );
}
