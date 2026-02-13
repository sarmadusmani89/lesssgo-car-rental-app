"use client";

import HeroBackground from '../components/HeroBackground';
import HeroFilter from '../components/HeroFilter';

export default function Hero() {
    return (
        <section className="min-h-screen pt-[140px] pb-[100px] relative bg-white overflow-hidden flex items-center">
            <HeroBackground />
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative z-10 w-full flex justify-end items-center">
                    <HeroFilter />
                </div>
            </div>
        </section>
    );
}
