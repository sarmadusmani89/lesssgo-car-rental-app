import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
    return (
        <div className="p-10 bg-white border border-slate-100 rounded-[1.5rem] text-left transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1) hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:border-blue-300 group flex flex-col">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-8 text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200">
                <Icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#0f172a] tracking-tight">{title}</h3>
            <p className="text-[0.9375rem] text-slate-500 leading-relaxed m-0">{description}</p>
        </div>
    );
}
