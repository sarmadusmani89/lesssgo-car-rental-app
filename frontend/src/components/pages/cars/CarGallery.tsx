'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';

interface Props {
  vehicleId: string;
}

export default function VehicleGallery({ vehicleId }: Props) {
  const images = [1, 2, 3].map(
    (n) => `/vehicles/vehicle-${vehicleId}/${n}.jpg`
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {images.map((src, idx) => (
          <div 
            key={src}
            className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-transparent hover:border-accent transition-all duration-300"
            onClick={() => setActiveIndex(idx)}
          >
            <img
              src={src}
              alt={`Vehicle view ${idx + 1}`}
              className="w-48 h-32 md:w-56 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-card/90 backdrop-blur-sm text-foreground text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-border/50">
                View Large
              </span>
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox 
          images={images}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </div>
  );
}
