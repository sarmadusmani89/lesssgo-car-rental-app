'use client';

import FAQ from '@/components/common/FAQ';
import { FAQS } from '@/data/faqs';
import styles from '@/app/(public)/faq/faq.module.css';

export default function FAQList() {
    const categories = Array.from(new Set(FAQS.map(faq => faq.category || 'General')));

    return (
        <section className={styles.content}>
            <div className="container">
                {categories.map((category) => (
                    <div key={category} className={styles.category}>
                        <h2 className={styles.categoryTitle}>{category}</h2>
                        <div className={styles.faqList}>
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
