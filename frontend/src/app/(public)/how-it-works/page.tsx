import styles from './how-it-works.module.css';
import HowItWorksHero from '@/components/pages/how-it-works/HowItWorksHero';
import HowItWorksSteps from '@/components/pages/how-it-works/HowItWorksSteps';
import HowItWorksCTA from '@/components/pages/how-it-works/HowItWorksCTA';

export default function HowItWorksPage() {
    return (
        <div className={styles.container}>
            <HowItWorksHero />
            <HowItWorksSteps />
            <HowItWorksCTA />
        </div>
    );
}
