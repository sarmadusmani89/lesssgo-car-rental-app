'use client';

import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function HomeFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: 'What do I need to rent a car?',
            answer: 'You\'ll need a valid driver\'s license, a credit card in your name, and a government-issued ID. International travelers may need an International Driving Permit.',
        },
        {
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel up to 24 hours before your pickup time for a full refund. Cancellations within 24 hours may incur a small fee.',
        },
        {
            question: 'Are there hidden fees?',
            answer: 'None at all. The price you see at checkout includes taxes, basic insurance, and unlimited mileage for most vehicles.',
        },
        {
            question: 'Do you offer airport pickup?',
            answer: 'Absolutely. We offer premium airport concierge service where your car will be waiting for you right at the arrivals terminal.',
        }
    ];

    return (
        <section className="section-padding bg-gray-50/50">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-lg">Everything you need to know about our premium car rental experience.</p>
                </div>

                <div className="max-w-4xl mx-auto grid gap-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-blue-500 shadow-md' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-500'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-6">Still have more questions?</p>
                    <Link href="/faq" className="btn btn-outline">
                        View Full FAQ Page
                    </Link>
                </div>
            </div>
        </section>
    );
}
