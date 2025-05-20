'use client';
import React from 'react';

import Link from 'next/link';

export default function JournalPostHero({ 
  backgroundImage = "/images/hero-background.png",
  categories = ["All", "Design"],
  title = "A Taste of Mocha Mousse",
  excerpt = "Explore the must-see highlights of this year's bold and boundary-pushing",
  ctaLink = "#"
}) {
  return (
    <section 
      className="relative min-h-[80vh] flex items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
        <div className="max-w-xl">
          <div className="text-white mb-4">
            {categories.map((category, index) => (
              <span key={index} className="inline-block font-medium">
                {index > 0 && <span className="mx-1">·</span>}
                {category}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">{title}</h1>
          
          <p className="text-lg text-white opacity-90 mb-8">{excerpt}</p>
          
          <Link href={ctaLink} className="inline-flex items-center text-white border border-white px-6 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors">
            <span>Show more</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="9" viewBox="0 0 25 9" fill="none" className="ml-2">
              <path d="M24.35 4.85C24.55 4.66 24.55 4.34 24.35 4.15L21.17 0.96C20.98 0.77 20.66 0.77 20.46 0.96C20.27 1.16 20.27 1.48 20.46 1.67L23.29 4.5L20.46 7.33C20.27 7.52 20.27 7.84 20.46 8.04C20.66 8.23 20.98 8.23 21.17 8.04L24.35 4.85ZM0 5H24V4H0V5Z" fill="white"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}