import Rating from '@/components/ui/Rating';
import { Testimonial } from '@/types/testimonial';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    const avatar = testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`;

    return (
        <div className="bg-white p-10 rounded-[1.5rem] border border-black/5 flex flex-col gap-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:border-blue-500/10 cursor-default relative overflow-hidden">
            <div className="text-amber-400 flex gap-1">
                <Rating rating={testimonial.rating} />
            </div>
            <p className="text-lg text-slate-600 leading-relaxed flex-1 font-medium">&ldquo;{testimonial.content}&rdquo;</p>
            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex flex-col">
                    <h4 className="text-base font-bold text-[#0f172a] mb-0.5">{testimonial.name}</h4>
                    <span className="text-sm text-slate-500 font-medium">{testimonial.role}</span>
                </div>
            </div>
        </div>
    );
}
