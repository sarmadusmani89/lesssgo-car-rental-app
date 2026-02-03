import styles from '@/app/(public)/privacy/privacy.module.css';
import PrivacyHero from '@/components/pages/privacy/PrivacyHero';
import PrivacyContent from '@/components/pages/privacy/PrivacyContent';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <PrivacyHero />
            <PrivacyContent />
        </div>
    );
}
