import styles from '@/app/(public)/terms/terms.module.css';
import TermsHero from '@/components/pages/terms/TermsHero';
import TermsContent from '@/components/pages/terms/TermsContent';

export default function TermsPage() {
    return (
        <div className={`${styles.container} py-20 md:py-32`}>
            <TermsHero />
            <TermsContent />
        </div>
    );
}
