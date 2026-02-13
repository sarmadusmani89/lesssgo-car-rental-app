import styles from '@/app/(public)/(home)/page.module.css';
import Hero from '@/components/pages/home/sections/Hero';
import Benefits from '@/components/pages/home/sections/Benefits';
import Testimonials from '@/components/pages/home/sections/Testimonials';
import FeaturedCars from '@/components/pages/home/sections/FeaturedCars';
import HomeFAQ from '@/components/pages/home/sections/HomeFAQ';
import CTA from '@/components/pages/home/sections/CTA';

export default function Home() {
    return (
        <div className={styles.home}>
            <Hero />
            <FeaturedCars />
            <Benefits />
            <Testimonials />
            <HomeFAQ />
            <CTA />
        </div>
    );
}