'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '@/data/faqs';

interface FAQProps {
    items: FAQItem[];
    allowMultiple?: boolean;
}

export default function FAQ({ items, allowMultiple = false }: FAQProps) {
    const [openIndices, setOpenIndices] = useState<number[]>([]);

    const toggleIndex = (index: number) => {
        if (allowMultiple) {
            setOpenIndices(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenIndices(prev => prev.includes(index) ? [] : [index]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid gap-4">
            {items.map((faq, index) => {
                const isOpen = openIndices.includes(index);
                return (
                    <div
                        key={index}
                        className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm ${isOpen
                                ? 'border-blue-500 shadow-md'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                    >
                        <button
                            onClick={() => toggleIndex(index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left"
                        >
                            <span
                                className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? 'text-blue-600' : 'text-gray-900 hover:text-blue-500'
                                    }`}
                            >
                                {faq.question}
                            </span>
                            <div
                                className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                    }`}
                            >
                                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                        </button>
                        <div
                            className="overflow-hidden transition-all duration-300 ease-in-out"
                            style={{
                                maxHeight: isOpen ? '24rem' : '0',
                                opacity: isOpen ? 1 : 0
                            }}
                        >
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
