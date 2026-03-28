import FAQ from '@/components/common/FAQ/FAQ';
import { FAQS } from '@/data/faqs';

export default function FAQList() {
    const categories = Array.from(new Set(FAQS.map(faq => faq.category || 'General')));

    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                {categories.map((category) => (
                    <div key={category} className="mb-16 last:mb-0">
                        <h2 className="text-3xl font-bold text-[#020617] mb-8 pb-3 border-b-4 border-primary inline-block">
                            {category}
                        </h2>
                        <div className="w-full">
                            <FAQ
                                items={FAQS.filter((faq) => (faq.category || 'General') === category)}
                                allowMultiple={true}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
