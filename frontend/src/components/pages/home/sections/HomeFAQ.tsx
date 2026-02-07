'use client';

import Link from 'next/link';
import FAQ from '@/components/common/FAQ/FAQ';
import { FAQS } from '@/data/faqs';

export default function HomeFAQ() {
    const importantFaqs = FAQS.filter(faq => faq.isImportant);

    return (
        <section className="section-padding bg-gray-50/50">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 text-lg">Everything you need to know about our premium car rental experience.</p>
                </div>

                <FAQ items={importantFaqs} />

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
