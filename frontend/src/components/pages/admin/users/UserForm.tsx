'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../../../types/user';
import FormInput from '../../../ui/FormInput';
import { Loader2, Shield, User as UserIcon } from 'lucide-react';

interface UserFormProps {
    user: User | null;
    onSubmit: (id: string, data: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export default function UserForm({ user, onSubmit, onCancel, isSubmitting }: UserFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: UserRole.USER
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email,
                role: user.role
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            await onSubmit(user.id, formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-4">
                <FormInput
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter user's full name"
                    required
                />

                <FormInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                    disabled // Email shouldn't be editable for existing users usually
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1.5">
                        <Shield size={14} className="text-slate-400" />
                        Access Level
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: UserRole.USER })}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.role === UserRole.USER
                                ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <UserIcon size={24} className={formData.role === UserRole.USER ? 'text-blue-600' : 'text-slate-300'} />
                            <span className="mt-2 font-bold text-sm tracking-tight">Standard User</span>
                            <span className="text-[10px] opacity-60 font-medium">Limited access</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: UserRole.ADMIN })}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.role === UserRole.ADMIN
                                ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                                }`}
                        >
                            <Shield size={24} className={formData.role === UserRole.ADMIN ? 'text-blue-600' : 'text-slate-300'} />
                            <span className="mt-2 font-bold text-sm tracking-tight">System Admin</span>
                            <span className="text-[10px] opacity-60 font-medium">Full access</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
