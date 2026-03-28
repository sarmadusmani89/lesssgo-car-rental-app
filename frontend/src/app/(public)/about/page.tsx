import AboutHero from '@/components/pages/about/sections/AboutHero';
import AboutStory from '@/components/pages/about/sections/AboutStory';
import AboutStats from '@/components/pages/about/sections/AboutStats';
import AboutValues from '@/components/pages/about/sections/AboutValues';

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <AboutHero />
            <AboutStory />
            <AboutStats />
            <AboutValues />
        </div>
    );
}
