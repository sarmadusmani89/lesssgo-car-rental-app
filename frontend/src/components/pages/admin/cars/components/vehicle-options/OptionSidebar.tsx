"use client";

import { LucideIcon } from "lucide-react";

interface OptionType {
    key: string;
    label: string;
    icon: LucideIcon;
}

interface Props {
    options: OptionType[];
    activeTab: string;
    onTabChange: (key: string) => void;
}

export default function OptionSidebar({ options, activeTab, onTabChange }: Props) {
    return (
        <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 space-y-1">
            {options.map((type) => {
                const Icon = type.icon;
                return (
                    <button
                        key={type.key}
                        onClick={() => onTabChange(type.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === type.key
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-gray-500 hover:bg-white hover:text-blue-600'
                            }`}
                    >
                        <Icon size={18} />
                        {type.label}
                    </button>
                );
            })}
        </div>
    );
}
