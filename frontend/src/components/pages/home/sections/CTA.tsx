import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
            <div className="absolute inset-0 bg-background/85 backdrop-blur-[4px] z-[1]" />

            <div className="container mx-auto px-4 md:px-6 relative z-[2]">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
                    <div className="flex-1 text-left max-w-2xl">
                        <h2 className="text-5xl font-extrabold text-[#020617] mb-4 tracking-tighter leading-tight">Can&apos;t Find What <span className="text-primary">You&apos;re Looking For?</span></h2>
                        <p className="text-lg text-muted-foreground leading-relaxed font-medium">Let our specialists help you find your perfect car. We have access to exclusive inventory and can source any luxury car you desire.</p>
                    </div>

                    <div className="flex gap-4 shrink-0">
                        <Button href="/contact" size="lg" className="hover:-translate-y-1">
                            Contact Us <ArrowRight size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
