'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface Props {
  images: string[];
}

export default function ImageGalleryWithLightbox({ images }: Props) {
  const [selected, setSelected] = useState(0);

  const nextImage = () => setSelected((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelected((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-6">
      {/* Main Image Viewport */}
      <div className="relative aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9] bg-slate-50 rounded-[2rem] overflow-hidden group border border-gray-100/50 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={images[selected]}
            alt={`Vehicle Image ${selected + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>

        {/* Hover Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all shadow-xl pointer-events-auto"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all shadow-xl pointer-events-auto"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Thumbnails Navigation */}
      <div className="flex flex-wrap gap-4 px-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative w-24 aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 ${i === selected
              ? 'ring-4 ring-blue-600/20 border-2 border-blue-600 ring-offset-2 scale-105'
              : 'border-2 border-transparent hover:border-gray-200 grayscale-[50%] hover:grayscale-0'
              }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {i === selected && (
              <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[1px]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
