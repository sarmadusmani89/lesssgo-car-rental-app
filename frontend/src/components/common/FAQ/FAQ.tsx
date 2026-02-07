'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQItem } from '@/data/faqs';
import styles from './FAQ.module.css';

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
        <div className={styles.container}>
            {items.map((faq, index) => {
                const isOpen = openIndices.includes(index);
                return (
                    <div
                        key={index}
                        className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                    >
                        <button
                            onClick={() => toggleIndex(index)}
                            className={styles.questionButton}
                        >
                            <span className={`${styles.questionText} ${isOpen ? styles.questionTextOpen : ''}`}>
                                {faq.question}
                            </span>
                            <div className={`${styles.iconWrapper} ${isOpen ? styles.iconWrapperOpen : ''}`}>
                                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                            </div>
                        </button>
                        <div
                            className={styles.answerWrapper}
                            style={{
                                maxHeight: isOpen ? '24rem' : '0',
                                opacity: isOpen ? 1 : 0
                            }}
                        >
                            <div className={styles.answerContent}>
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
