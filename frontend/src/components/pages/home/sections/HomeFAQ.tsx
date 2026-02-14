'use client';

import Link from 'next/link';
import FAQ from '@/components/common/FAQ/FAQ';
import { FAQS } from '@/data/faqs';

export default function HomeFAQ() {
    const importantFaqs = FAQS.filter(faq => faq.isImportant);

    export default function HomeFAQ() {
        const importantFaqs = FAQS.filter(faq => faq.isImportant);

        return (
            <section className="py-24 bg-slate-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-500 text-lg">Everything you need to know about our premium car rental experience.</p>
                    </div>

                    <FAQ items={importantFaqs} />

                    <div className="text-center mt-12">
                        <p className="text-slate-500 font-medium mb-6">Still have more questions?</p>
                        <Link href="/faq" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#0f172a] text-[#0f172a] rounded-xl font-bold transition-all hover:bg-[#0f172a] hover:text-white">
                            View Full FAQ Page
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
