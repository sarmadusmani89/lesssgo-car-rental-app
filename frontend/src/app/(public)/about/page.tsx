import styles from './about.module.css';
import AboutHero from '@/components/pages/about/AboutHero';
import AboutStory from '@/components/pages/about/AboutStory';
import AboutStats from '@/components/pages/about/AboutStats';
import AboutValues from '@/components/pages/about/AboutValues';

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <AboutHero />
            <AboutStory />
            <AboutStats />
            <AboutValues />
        </div>
    );
}
