'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../../../types/user';

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    user: User | null;
    isSubmitting: boolean;
}

export default function DeleteUserModal({ isOpen, onClose, onConfirm, user, isSubmitting }: DeleteUserModalProps) {
    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 pt-7 text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-rose-600" size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-2">
                                Delete <span className="text-rose-600">User</span>?
                            </h3>

                            <p className="text-slate-500 text-sm font-medium mb-6">
                                You are about to permanently remove <span className="text-slate-900 font-bold">{user.name || user.email}</span>. This action cannot be undone.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? 'Deleting...' : (
                                        <>
                                            <Trash2 size={18} />
                                            Confirm Deletion
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
