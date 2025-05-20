'use client';
import React from 'react';

import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative h-[60vh] mb-10 overflow-hidden">
      <Image
        src="/images/destinations-hero.jpg" // This would need to be provided
        alt="Destinations with CinCin Hotels"
        fill
        className="object-cover"
        priority
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
        <div className="container mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-xl">
            Discover Extraordinary Destinations
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-2xl">
            Explore curated experiences in the most exclusive locations across Europe
          </p>
        </div>
      </div>
    </div>
  );
}