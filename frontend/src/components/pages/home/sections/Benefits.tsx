import { Shield, Star, Zap, MapPin, Calendar, Headphones } from 'lucide-react';
import BenefitCard from '../components/BenefitCard';

const features = [
    {
        icon: Shield,
        title: "Pristine Condition",
        description: "Meticulously maintained and sanitized cars ensuring a showroom experience every time."
    },
    {
        icon: Star,
        title: "Exclusive Cars",
        description: "A curated selection of the latest models from the Current PNG dealers"
    },
    {
        icon: Zap,
        title: "Seamless Booking",
        description: "Digital verification and instant confirmation. Get on the road in minutes, not hours."
    },
    {
        icon: MapPin,
        title: "White-Glove Delivery",
        description: "We deliver and pick up your car at your home, hotel, or private airport terminal."
    },
    {
        icon: Calendar,
        title: "Flexible Cancellation",
        description: "Change of plans? Enjoy free cancellation up to 48 hours before your reservation begins."
    },
    {
        icon: Headphones,
        title: "24/7 VIP Support",
        description: "Dedicated concierge team available around the clock to assist with your journey."
    }
];

export default function Benefits() {
    return (
        <section className="py-[100px] bg-white relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-[700px] mx-auto mb-16">
                    <h2 className="text-5xl font-extrabold tracking-tight mb-5 text-[#0f172a]">Why Choose LessGo</h2>
                    <p className="text-[1.125rem] text-slate-500 leading-relaxed">Experience automotive excellence with our uncompromising standards and world-class service.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <BenefitCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
