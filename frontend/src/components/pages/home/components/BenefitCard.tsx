import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
    return (
        <div className="p-10 bg-card border border-border rounded-[1.5rem] text-left transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-2 hover:shadow-xl hover:border-accent/40 group flex flex-col">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-8 text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow/50">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-primary tracking-tight">{title}</h3>
            <p className="text-[0.9375rem] text-muted-foreground leading-relaxed m-0">{description}</p>
        </div>
    );
}
