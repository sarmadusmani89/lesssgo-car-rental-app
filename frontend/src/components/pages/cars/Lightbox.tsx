'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((index - 1 + images.length) % images.length);
  };
  
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((index + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300" onClick={onClose}>
      <button 
        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-[10000]"
        onClick={onClose}
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      <button 
        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-[10000]"
        onClick={prev}
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center select-none" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[index]} 
          alt={`Gallery image ${index + 1}`}
          className="max-w-full max-h-[85vh] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300 object-contain" 
        />
        
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
          <span className="text-white/70 text-sm font-medium">
            {index + 1} <span className="mx-1 opacity-30">/</span> {images.length}
          </span>
        </div>
      </div>

      <button 
        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 z-[10000]"
        onClick={next}
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>
    </div>
  );
};

export default Lightbox;
