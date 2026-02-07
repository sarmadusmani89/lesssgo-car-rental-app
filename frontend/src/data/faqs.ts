export interface FAQItem {
    question: string;
    answer: string;
    category?: string;
    isImportant?: boolean;
}

export const FAQS: FAQItem[] = [
    {
        category: 'Booking',
        question: 'What do I need to rent a car?',
        answer: "You'll need a valid driver's license, a credit card in your name, and a government-issued ID. International travelers may need an International Driving Permit.",
        isImportant: true,
    },
    {
        category: 'Booking',
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel up to 48 hours before your pickup time for a full refund. Cancellations within 48 hours may incur a small fee.',
        isImportant: true,
    },
    {
        category: 'Payments',
        question: 'Are there hidden fees?',
        answer: 'None at all. The price you see at checkout includes taxes, basic insurance, and unlimited mileage for most vehicles.',
        isImportant: true,
    },
    {
        category: 'Support',
        question: 'Do you offer 24/7 customer support?',
        answer: 'Absolutely. Our customer support team is available 24/7 to assist you with any questions or emergencies during your rental period waiting for you right at the arrivals terminal.',
        isImportant: true,
    },
    {
        category: 'Booking',
        question: 'How do I book a car?',
        answer: "Browse our fleet, select your desired car, choose your pickup and return dates, and complete the booking form. You'll receive instant confirmation via email.",
    },
    {
        category: 'Payments',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and debit cards. Payment is processed securely at the time of booking.',
    },
    {
        category: 'Payments',
        question: 'When is payment charged?',
        answer: "Payment is authorized at booking and charged 24 hours before your pickup time. You'll receive a receipt via email.",
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
        question: 'What if I have an accident or breakdown?',
        answer: 'Contact our 24/7 emergency hotline immediately. We provide roadside assistance and will arrange a replacement car if needed.',
    }
];
