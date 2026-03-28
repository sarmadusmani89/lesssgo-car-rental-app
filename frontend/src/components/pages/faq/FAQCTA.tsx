import Link from 'next/link';

export default function FAQCTA() {
    return (
        <section className="py-20 text-center bg-slate-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Still have questions?</h2>
                <p className="text-lg text-muted-foreground mb-8">Can't find the answer you're looking for? Please contact our support team.</p>
                <Link href="/contact" className="btn btn-primary btn-lg px-10">
                    Contact Us
                </Link>
            </div>
        </section>
    );
}
