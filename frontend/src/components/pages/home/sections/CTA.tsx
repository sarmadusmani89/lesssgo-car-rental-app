import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-24 relative overflow-hidden font-inter">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/light-theme-luxury-car-bg.png"
                    alt="Luxury Car Background"
                    fill
                    quality={100}
                    className="object-cover object-center"
                />
            </div>
            <div className="absolute inset-0 bg-white/85 backdrop-blur-[4px] z-[1]" />

            <div className="container mx-auto px-4 md:px-6 relative z-[2]">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
                    <div className="flex-1 text-left max-w-2xl">
                        <h2 className="text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tighter leading-tight">Can&apos;t Find What You&apos;re Looking For?</h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">Let our specialists help you find your perfect car. We have access to exclusive inventory and can source any luxury car you desire.</p>
                    </div>

                    <div className="flex gap-4 shrink-0">
                        <Link href="/contact" className="inline-flex items-center gap-2 bg-[#000000] text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
                            Contact Us <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
