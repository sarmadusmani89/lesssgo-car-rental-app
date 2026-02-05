"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

interface MultiSelectProps {
    options: string[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export default function MultiSelect({ options, value = [], onChange, placeholder = "Select options..." }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newValue = value.includes(option)
            ? value.filter(v => v !== option)
            : [...value, option];
        onChange(newValue);
    };

    const removeOption = (e: React.MouseEvent, option: string) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== option));
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-gray-200 bg-white cursor-pointer flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-blue-500 transition"
            >
                {value.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {value.map(val => (
                            <span
                                key={val}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100"
                            >
                                {val}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:text-blue-900"
                                    onClick={(e) => removeOption(e, val)}
                                />
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400 font-medium">{placeholder}</span>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
                    {options.map(option => (
                        <div
                            key={option}
                            onClick={() => toggleOption(option)}
                            className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition"
                        >
                            <span className={`text-sm font-medium ${value.includes(option) ? 'text-blue-600' : 'text-gray-700'}`}>
                                {option}
                            </span>
                            {value.includes(option) && <Check size={16} className="text-blue-600" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
