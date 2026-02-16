"use client";

import { Trash2 } from "lucide-react";

interface Props {
    item: string;
    onDelete: () => void;
}

export default function OptionItem({ item, onDelete }: Props) {
    return (
        <div
            className="group h-[52px] flex items-center justify-between px-5 py-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300"
        >
            <span className="font-semibold text-gray-700 text-sm truncate max-w-[80%]">{item}</span>
            <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                title="Delete"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
