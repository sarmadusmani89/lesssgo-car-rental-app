import HowItWorksHero from '@/components/pages/how-it-works/HowItWorksHero';
import HowItWorksSteps from '@/components/pages/how-it-works/HowItWorksSteps';
import HowItWorksCTA from '@/components/pages/how-it-works/HowItWorksCTA';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white">
            <HowItWorksHero />
            <HowItWorksSteps />
            <HowItWorksCTA />
        </div>
    );
}
