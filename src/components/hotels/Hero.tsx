// @ts-nocheck
import React, { MouseEvent } from 'react';
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero({ 
  description = "CINCIN® hotels is a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.",
  backgroundImage = "/images/hero-bg.jpg"
}) {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7,
      transition: { 
        delay: 0.8,
        duration: 0.5
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      className="relative min-h-screen flex items-end"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-white w-full pb-20">
        <div className="flex flex-col items-start max-w-xl">
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl leading-relaxed font-normal"
          >
            {description}
          </motion.p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 mb-8"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate={["visible", "pulse"]}
        onClick={scrollToNext}
      >
        <div className="w-10 h-10 border border-white/50 rounded-full flex items-center justify-center cursor-pointer hover:border-white/80 transition-all">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white/70 hover:text-white transition-colors"
          >
            <path d="M12 5v14"></path>
            <path d="M19 12l-7 7-7-7"></path>
          </svg>
        </div>
      </motion.div>
    </section>
  );
}