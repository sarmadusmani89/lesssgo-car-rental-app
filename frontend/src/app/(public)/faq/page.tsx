import FAQHero from '@/components/pages/faq/FAQHero';
import FAQList from '@/components/pages/faq/FAQList';
import FAQCTA from '@/components/pages/faq/FAQCTA';

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-white">
            <FAQHero />
            <FAQList />
            <FAQCTA />
        </div>
    );
}
