import { Star } from 'lucide-react';

interface RatingProps {
    rating: number;
    maxRating?: number;
    className?: string;
}

export default function Rating({ rating, maxRating = 5, className = '' }: RatingProps) {
    return (
        <div className={`flex gap-1 ${className}`}>
            {[...Array(maxRating)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    strokeWidth={i < rating ? 0 : 1.5}
                    className={i < rating ? "text-amber-400" : "text-border"}
                />
            ))}
        </div>
    );
}
