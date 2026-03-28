'use client';

import ContactHero from '@/components/pages/contact/sections/ContactHero';
import ContactInfo from '@/components/pages/contact/sections/ContactInfo';
import ContactForm from '@/components/pages/contact/sections/ContactForm';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            <ContactHero />
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
                        <ContactInfo />
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
