'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HotelsHero({
  title = "CINCIN® Exceptional Hotels",
  subtitle = "Discover our curated collection of unique accommodations across the most desirable destinations",
  backgroundImage = "/images/hotels/hotel-1.jpg"
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeInOut",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scrollIndicatorVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 0.7,
      transition: { 
        delay: 1.2,
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

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Background image with crossfade effect */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-hidden="true"
      >
        <img 
          src={backgroundImage} 
          alt="" 
          className="hidden" 
          onLoad={handleImageLoad}
        />
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/30"></div>
      
      {/* Content */}
      <motion.div 
        className="container mx-auto px-4 md:px-8 relative z-10 text-white pt-16"
        variants={containerVariants}
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
      >
        <div className="max-w-3xl">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl leading-relaxed font-light"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 mb-8"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate={isLoading ? "hidden" : ["visible", "pulse"]}
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