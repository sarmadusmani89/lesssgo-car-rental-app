'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface AuthSuccessProps {
    title: string;
    message: string;
    description?: string;
    actionText: string;
    actionHref: string;
    showAutoRedirect?: boolean;
    autoRedirectSeconds?: number;
}

export default function AuthSuccess({
    title,
    message,
    description,
    actionText,
    actionHref,
    showAutoRedirect = false,
    autoRedirectSeconds = 5
}: AuthSuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <CheckCircle className="text-emerald-500" size={56} />
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight italic font-outfit uppercase">
                {title}
            </h2>

            <p className="text-slate-600 font-bold mb-1">
                {message}
            </p>

            {description && (
                <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed italic">
                    {description}
                </p>
            )}

            <div className="flex flex-col gap-4 w-full mt-6">
                <Link
                    href={actionHref}
                    className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 py-4 shadow-lg hover:scale-[1.02] transition-transform font-black uppercase text-xs tracking-widest"
                >
                    {actionText}
                </Link>

                {showAutoRedirect && (
                    <p className="text-[10px] text-slate-400 font-bold flex items-center justify-center gap-2 uppercase tracking-tighter">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                        Redirecting automatically in a few seconds...
                    </p>
                )}
            </div>
        </div>
    );
}
