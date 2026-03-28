import { Search, Calendar, Car, Sparkles } from 'lucide-react';

export default function HowItWorksSteps() {
    const steps = [
        {
            icon: Search,
            title: 'Browse Our Fleet',
            description: 'Explore our wide selection of premium cars. Filter by type, price, or features to find your perfect ride.',
        },
        {
            icon: Calendar,
            title: 'Select Dates',
            description: 'Choose your pickup and return dates. View real-time availability and transparent pricing with no hidden fees.',
        },
        {
            icon: Car,
            title: 'Book & Confirm',
            description: 'Complete your booking with our secure payment system. Receive instant confirmation and digital documents.',
        },
        {
            icon: Sparkles,
            title: 'Drive Away',
            description: 'Pick up your car at the scheduled time. Enjoy your journey with 24/7 roadside assistance included.',
        },
    ];

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-8 items-center p-8 md:p-10 mb-8 bg-white rounded-[2rem] shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-slate-50 relative group last:mb-0">
                            <div className="text-5xl md:text-6xl font-black text-accent opacity-20 leading-none">
                                {index + 1}
                            </div>
                            <div className="w-20 h-20 bg-gradient-to-br from-accent to-[#7c3aed] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                                <Icon size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-primary mb-3">{step.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
