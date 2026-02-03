'use client';

import { useState } from 'react';

interface Props {
  images: string[];
}

export default function ImageGalleryWithLightbox({ images }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <img
        src={images[selected]}
        alt={`Vehicle Image ${selected + 1}`}
        className="w-full h-64 object-cover rounded mb-4 cursor-pointer"
        onClick={() => alert('Open lightbox (implement if needed)')}
      />
      <div className="flex gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Thumbnail ${i + 1}`}
            className={`w-20 h-20 object-cover rounded cursor-pointer border ${
              i === selected ? 'border-blue-500' : 'border-gray-300'
            }`}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
    </div>
  );
}
