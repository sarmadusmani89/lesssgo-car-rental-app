'use client';

import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../../../types/user';
import UserForm from './UserForm';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSubmit: (id: string, data: any) => Promise<void>;
    isSubmitting: boolean;
}

export default function UserFormModal({ isOpen, onClose, user, onSubmit, isSubmitting }: UserFormModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/20 overflow-hidden"
                    >
                        <div className="p-8 pt-7 text-center">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">
                                    Edit <span className="text-blue-600">User</span>
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Update profile information and access role.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <UserForm
                            user={user}
                            onSubmit={onSubmit}
                            onCancel={onClose}
                            isSubmitting={isSubmitting}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
