// src/components/common/TestimonialCard.tsx
import Rating from '@/components/ui/Rating';
// We'll reuse the Testimonials.module.css via a prompt or a new module. 
// For better modularity, let's assume it accepts a className or uses inline styles for now, 
// OR we refactor the CSS. To keep it clean, I'll use the existing usage pattern 
// and import the specific styles if moved, but since styles are in pages/home,
// we should ideally move card styles to a common module or pass them.
// Let's create a dedicated CSS module for this card to be truly reusable.

import styles from './TestimonialCard.module.css';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    quote: string;
    rating: number;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.stars}>
                <Rating rating={testimonial.rating} />
            </div>
            <p className={styles.quote}>&ldquo;{testimonial.quote}&rdquo;</p>
            <div className={styles.user}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={testimonial.image} alt={testimonial.name} className={styles.avatar} />
                <div className={styles.userInfo}>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                </div>
            </div>
        </div>
    );
}
