"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function AdminCarSearch({ search, onSearchChange }: Props) {
    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 p-4 rounded-2xl group transition-all duration-300">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or brand..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
