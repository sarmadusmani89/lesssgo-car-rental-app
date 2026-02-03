import styles from '@/app/(public)/terms/terms.module.css';
import TermsHero from '@/components/pages/terms/TermsHero';
import TermsContent from '@/components/pages/terms/TermsContent';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <TermsHero />
            <TermsContent />
        </div>
    );
}
