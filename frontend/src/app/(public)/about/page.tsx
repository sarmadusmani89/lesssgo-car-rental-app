import styles from './about.module.css';
import AboutHero from '@/components/pages/about/sections/AboutHero';
import AboutStory from '@/components/pages/about/sections/AboutStory';
import AboutStats from '@/components/pages/about/sections/AboutStats';
import AboutValues from '@/components/pages/about/sections/AboutValues';

export default function AboutPage() {
    return (
        <div className={`${styles.container} py-20 md:py-32`}>
            <AboutHero />
            <AboutStory />
            <AboutStats />
            <AboutValues />
        </div>
    );
}
