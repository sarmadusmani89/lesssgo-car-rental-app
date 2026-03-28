import { LucideIcon } from 'lucide-react';

interface ContactInfoItemProps {
    icon: LucideIcon;
    title: string;
    content: string;
}

export default function ContactInfoItem({ icon: Icon, title, content }: ContactInfoItemProps) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-[#7c3aed] text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                <Icon size={24} />
            </div>
            <div>
                <div className="text-lg font-bold text-primary mb-1">{title}</div>
                <div className="text-muted-foreground leading-relaxed">{content}</div>
            </div>
        </div>
    );
}
