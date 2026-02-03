import styles from './faq.module.css';
import FAQHero from '@/components/pages/faq/FAQHero';
import FAQList from '@/components/pages/faq/FAQList';
import FAQCTA from '@/components/pages/faq/FAQCTA';

export default function FAQPage() {
    return (
        <div className={styles.container}>
            <FAQHero />
            <FAQList />
            <FAQCTA />
        </div>
    );
}
