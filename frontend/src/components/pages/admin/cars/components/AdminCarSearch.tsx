"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
}

export default function AdminCarSearch({ search, onSearchChange }: Props) {
    return (
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30">
            <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or brand..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}
