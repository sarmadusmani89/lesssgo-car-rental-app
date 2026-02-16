"use client";

import { Plus } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    placeholder: string;
}

export default function OptionInput({ value, onChange, onAdd, placeholder }: Props) {
    return (
        <div className="flex gap-3 mb-8">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onAdd()}
                className="flex-1 px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-sm"
                placeholder={placeholder}
            />
            <button
                onClick={onAdd}
                disabled={!value.trim()}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-gray-200"
            >
                <Plus size={18} />
                Add
            </button>
        </div>
    );
}
