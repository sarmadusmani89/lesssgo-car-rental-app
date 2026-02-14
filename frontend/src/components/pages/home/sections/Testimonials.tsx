import TestimonialCard from '@/components/common/TestimonialCard/TestimonialCard';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Business Executive",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        quote: "The service was absolutely impeccable. The car was pristine, and the delivery was right on time. Highly recommended for business travel.",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Car Enthusiast",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        quote: "I've rented from many agencies, but the fleet quality here is unmatched. Driving the Porsche 911 was a dream come true.",
        rating: 5
    },
    {
        id: 3,
        name: "Emily Davis",
        role: "Travel Blogger",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80",
        quote: "Seamless booking process and incredible support. They made our road trip strictly unforgettable with the perfect convertible.",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-[800px] mx-auto mb-20">
                    <h2 className="text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">Trusted by <span className="text-blue-600">Excellence.</span></h2>
                    <p className="text-[#64748b] text-lg lg:text-[1.125rem] leading-relaxed">Don&apos;t just take our word for it. Here&apos;s what our premium clients have to say about their experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
