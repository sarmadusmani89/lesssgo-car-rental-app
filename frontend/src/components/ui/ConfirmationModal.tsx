'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle2, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ConfirmationVariant = 'danger' | 'success' | 'info' | 'warning';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmationVariant;
    isSubmitting?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'info',
    isSubmitting = false
}: ConfirmationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const variantStyles = {
        danger: {
            icon: AlertTriangle,
            iconClass: 'text-rose-600',
            bgClass: 'bg-rose-50',
            borderClass: 'border-rose-100',
            buttonClass: 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
        },
        success: {
            icon: CheckCircle2,
            iconClass: 'text-emerald-600',
            bgClass: 'bg-emerald-50',
            borderClass: 'border-emerald-100',
            buttonClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
        },
        warning: {
            icon: HelpCircle,
            iconClass: 'text-amber-600',
            bgClass: 'bg-amber-50',
            borderClass: 'border-amber-100',
            buttonClass: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
        },
        info: {
            icon: Info,
            iconClass: 'text-blue-600',
            bgClass: 'bg-blue-50',
            borderClass: 'border-blue-100',
            buttonClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
        }
    };

    const style = variantStyles[variant];
    const Icon = style.icon;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                            <div className={`w-20 h-20 ${style.bgClass} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                <Icon className={style.iconClass} size={40} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-2 uppercase">
                                {title}
                            </h3>

                            <div className="text-slate-500 text-sm font-medium mb-6">
                                <p>{description}</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isSubmitting}
                                    className={`w-full py-4 ${style.buttonClass} text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]`}
                                >
                                    {isSubmitting ? 'Processing...' : confirmText}
                                </button>

                                <button
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-[0.98]"
                                >
                                    {cancelText}
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
        </AnimatePresence>,
        document.body
    );
}
