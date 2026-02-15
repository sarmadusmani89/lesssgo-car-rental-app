'use client';

import { Star } from 'lucide-react';

interface RatingSelectorProps {
    rating: number;
    onChange: (rating: number) => void;
    label?: string;
}

export default function RatingSelector({ rating, onChange, label = "Rating" }: RatingSelectorProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`p-1 transition-colors ${rating >= star ? 'text-amber-500' : 'text-gray-300'}`}
                    >
                        <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                    </button>
                ))}
            </div>
        </div>
    );
}
