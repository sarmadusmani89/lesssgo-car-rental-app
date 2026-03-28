import Link from 'next/link';

export default function HowItWorksCTA() {
    return (
        <section className="py-20 text-center bg-primary text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight italic uppercase font-outfit">Ready to Get Started?</h2>
                <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Browse our fleet and find your perfect car today</p>
                <Link href="/cars" className="btn btn-accent btn-lg px-12">
                    View All Cars
                </Link>
            </div>
        </section>
    );
}
