'use client';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero({ 
  description = "CINCIN® hotels is a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.",
  ctaText = "Explore all Hotels",
  ctaLink = "/hotels",
  image = "/images/hero-interior.jpg"
}) {
  // Animation für das kreisförmige Element am unteren Rand
  const circleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 1.2,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Hauptbild */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="CINCIN Hotels Interior"
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Overlay für besseren Textkontrast (optional) */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Inhalt-Container */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end">
            {/* Beschreibungstext */}
            <div className="max-w-md text-white mb-8 md:mb-0">
              <p className="text-xl md:text-2xl leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* CTA-Button */}
            <Link 
              href={ctaLink}
              className="inline-flex items-center text-white bg-transparent border border-white hover:bg-white hover:text-gray-900 transition-colors duration-300 rounded-md px-6 py-3"
            >
              <span>{ctaText}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 25 9" 
                fill="none"
              >
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Kreisförmiges Element unten mittig */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial="initial"
        animate="animate"
        variants={circleVariants}
      >
        <div className="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center cursor-pointer hover:border-white/80 transition-all">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/70 hover:text-white transition-colors"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}