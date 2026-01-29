import styles from './page.module.css';
import Hero from '@/components/pages/home/Hero';
import Benefits from '@/components/pages/home/Benefits';
import Testimonials from '@/components/pages/home/Testimonials';
import FeaturedCars from '@/components/pages/home/FeaturedCars';

export default function Home() {
    return (
        <div className={styles.main}>
            <Hero />
            <Benefits />
            <Testimonials />
            <FeaturedCars />
        </div>
    );
}
