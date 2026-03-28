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
                className="w-full min-h-[46px] px-4 py-2 rounded-xl border border-border bg-card cursor-pointer flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-accent transition"
            >
                {value.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {value.map(val => (
                            <span
                                key={val}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-[11px] font-bold rounded-lg border border-accent/20"
                            >
                                {val}
                                <X
                                    size={12}
                                    className="cursor-pointer hover:rotate-90 transition-transform"
                                    onClick={(e) => removeOption(e, val)}
                                />
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-muted-foreground/60 font-medium text-sm">{placeholder}</span>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <ChevronDown size={18} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-card rounded-2xl shadow-xl border border-border py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200">
                    {options.map(option => (
                        <div
                            key={option}
                            onClick={() => toggleOption(option)}
                            className="px-4 py-3 hover:bg-muted flex items-center justify-between cursor-pointer transition-colors"
                        >
                            <span className={`text-sm font-bold ${value.includes(option) ? 'text-accent' : 'text-foreground/80'}`}>
                                {option}
                            </span>
                            {value.includes(option) && <Check size={16} className="text-accent" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
