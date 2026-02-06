'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = 'Select...', className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative w-[180px]", className)} ref={containerRef}>
            <button
                type="button"
                className={cn(
                    "flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl transition-all duration-200",
                    "hover:border-blue-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500",
                    isOpen && "border-blue-500 ring-2 ring-blue-100"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={cn("truncate", !selectedOption && "text-slate-400")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isOpen && "transform rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={cn(
                                "flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors",
                                option.value === value ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700 hover:bg-slate-50"
                            )}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span>{option.label}</span>
                            {option.value === value && <Check className="w-3.5 h-3.5" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
