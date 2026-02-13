"use client";

import Image from 'next/image';

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Image
                src="/images/hero-background.png"
                alt="Haval Jolion Pro"
                fill
                priority
                quality={100}
                className="object-cover object-left opacity-100"
            />
        </div>
    );
}
