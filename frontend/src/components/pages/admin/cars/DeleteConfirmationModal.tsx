'use client';

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    carBrand?: string;
    carName: string;
    isDeleting: boolean;
};

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, carBrand, carName, isDeleting }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={isDeleting ? undefined : onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 pt-11 text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-rose-600" size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-2 uppercase">
                                Delete <span className="text-rose-600">Vehicle</span>?
                            </h3>

                            <div className="text-slate-500 text-sm font-medium mb-6 space-y-1">
                                <p>Are you sure you want to remove this vehicle?</p>
                                <div className="text-slate-900 font-bold">
                                    {carBrand && <span className="text-[10px] text-slate-400 block uppercase tracking-widest leading-none mb-1">{carBrand}</span>}
                                    {carName}
                                </div>
                                <div className="mt-4 p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-[10px] text-rose-700 font-bold uppercase tracking-wider">
                                    This action cannot be undone
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    {isDeleting ? 'Deleting...' : (
                                        <>
                                            <Trash2 size={18} />
                                            Confirm Deletion
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all disabled:opacity-50 active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={isDeleting}
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
