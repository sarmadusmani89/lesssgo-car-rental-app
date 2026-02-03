'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/app/(public)/faq/faq.module.css';

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export default function FAQList() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQ[] = [
        {
            category: 'Booking',
            question: 'How do I book a car?',
            answer: 'Browse our fleet, select your desired car, choose your pickup and return dates, and complete the booking form. You\'ll receive instant confirmation via email.',
        },
        {
            category: 'Booking',
            question: 'Can I modify or cancel my booking?',
            answer: 'Yes, you can modify or cancel your booking up to 24 hours before your pickup time. Cancellations made within 24 hours may incur a fee.',
        },
        {
            category: 'Booking',
            question: 'What documents do I need to rent a car?',
            answer: 'You need a valid driver\'s license, a credit card in your name, and a government-issued ID. International travelers may need an International Driving Permit.',
        },
        {
            category: 'Payments',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and debit cards. Payment is processed securely at the time of booking.',
        },
        {
            category: 'Payments',
            question: 'When is payment charged?',
            answer: 'Payment is authorized at booking and charged 24 hours before your pickup time. You\'ll receive a receipt via email.',
        },
        {
            category: 'Payments',
            question: 'Are there any hidden fees?',
            answer: 'No, we believe in transparent pricing. All fees, including taxes and insurance, are clearly displayed before you confirm your booking.',
        },
        {
            category: 'Insurance',
            question: 'Is insurance included in the rental price?',
            answer: 'Basic insurance coverage is included in all our rental prices. Additional coverage options are available at checkout for enhanced protection.',
        },
        {
            category: 'Insurance',
            question: 'What does the insurance cover?',
            answer: 'Our basic insurance covers collision damage, theft protection, and third-party liability. Additional options include zero excess and roadside assistance.',
        },
        {
            category: 'Returns',
            question: 'What if I return the car late?',
            answer: 'Late returns are subject to additional charges. Please contact us if you need to extend your rental period. Extensions are subject to car availability.',
        },
        {
            category: 'Returns',
            question: 'Do I need to refill the tank before returning?',
            answer: 'Yes, please return the car with the same fuel level as pickup. Otherwise, a refueling charge will apply.',
        },
        {
            category: 'Support',
            question: 'Do you offer 24/7 customer support?',
            answer: 'Yes, our customer support team is available 24/7 to assist you with any questions or emergencies during your rental period.',
        },
        {
            category: 'Support',
            question: 'What if I have an accident or breakdown?',
            answer: 'Contact our 24/7 emergency hotline immediately. We provide roadside assistance and will arrange a replacement car if needed.',
        },
    ];

    const categories = Array.from(new Set(faqs.map(faq => faq.category)));

    return (
        <section className={styles.content}>
            <div className="container">
                {categories.map((category) => (
                    <div key={category} className={styles.category}>
                        <h2 className={styles.categoryTitle}>{category}</h2>
                        <div className={styles.faqList}>
                            {faqs
                                .filter((faq) => faq.category === category)
                                .map((faq, index) => {
                                    const globalIndex = faqs.indexOf(faq);
                                    const isOpen = openIndex === globalIndex;
                                    return (
                                        <div key={globalIndex} className={styles.faqItem}>
                                            <button
                                                className={styles.faqQuestion}
                                                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                                            >
                                                <span>{faq.question}</span>
                                                <ChevronDown
                                                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                                                    size={20}
                                                />
                                            </button>
                                            <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}>
                                                <p>{faq.answer}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
