'use client';

import { useState } from 'react';

interface Props {
  vehicleId: string;
}

export default function VehicleGallery({ vehicleId }: Props) {
  const images = [1, 2, 3].map(
    (n) => `/vehicles/vehicle-${vehicleId}/${n}.jpg`
  );

  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <>
      {/* Gallery */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {images.map((src) => (
          <img
            key={src}
            src={src}
            alt="Vehicle"
            style={{
              width: '200px',
              height: '140px',
              objectFit: 'cover',
              cursor: 'pointer',
              borderRadius: '8px',
            }}
            onClick={() => setActiveImage(src)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <img
            src={activeImage}
            alt="Vehicle Large"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: '12px',
            }}
          />
        </div>
      )}
    </>
  );
}
