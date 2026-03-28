import { Button } from '@/components/ui/Button';

export default function FAQCTA() {
    return (
        <section className="py-20 text-center bg-secondary/40">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#020617] mb-4 tracking-tight">Still have <span className="text-primary">questions?</span></h2>
                <p className="text-lg text-muted-foreground mb-8">Can&apos;t find the answer you&apos;re looking for? Please contact our support team.</p>
                <Button href="/contact" variant="primary" size="lg" className="px-10">
                    Contact Us
                </Button>
            </div>
        </section>
    );
}
