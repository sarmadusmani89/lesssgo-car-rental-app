'use client';

import React, { useState } from 'react';
import styles from '@/styles/vehicle-gallery.module.css';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const prev = () =>
    setIndex((index - 1 + images.length) % images.length);
  const next = () =>
    setIndex((index + 1) % images.length);

  return (
    <div className={styles.lightbox}>
      <span className={styles.close} onClick={onClose}>×</span>
      <button className={styles.navLeft} onClick={prev}>‹</button>
      <img src={images[index]} className={styles.lightboxImage} />
      <button className={styles.navRight} onClick={next}>›</button>
    </div>
  );
};

export default Lightbox;
