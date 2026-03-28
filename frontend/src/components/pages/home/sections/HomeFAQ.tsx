'use client';

import Link from 'next/link';
import FAQ from '@/components/common/FAQ/FAQ';
import { FAQS } from '@/data/faqs';

export default function HomeFAQ() {
    const importantFaqs = FAQS.filter(faq => faq.isImportant);

    return (
        <section className="py-24 bg-secondary/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#020617] mb-6 tracking-tight">Frequently Asked <span className="text-primary">Questions</span></h2>
                    <p className="text-muted-foreground text-lg">Everything you need to know about our premium car rental experience.</p>
                </div>

                <FAQ items={importantFaqs} />

                <div className="text-center mt-12">
                    <p className="text-muted-foreground font-medium mb-6">Still have more questions?</p>
                    <Link href="/faq" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-xl font-bold transition-all hover:bg-primary hover:text-primary-foreground">
                        View Full FAQ Page
                    </Link>
                </div>
            </div>
        </section>
    );
}
