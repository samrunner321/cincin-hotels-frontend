'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function DestinationHero({ destination }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <section className="relative overflow-hidden h-screen min-h-[700px] max-h-[900px]">
      {/* Split design with image (55%) and colored area (45%) */}
      <div className="flex h-full">
        {/* Image section with parallax effect */}
        <motion.div 
          className="relative w-full md:w-[55%] h-full overflow-hidden bg-gray-900"
          style={{ y: isLoaded ? imageY : 0 }}
        >
          <Image
            src={destination.heroImage || destination.image}
            alt={`${destination.name}, ${destination.country}`}
            fill
            priority
            quality={90}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
        
        {/* Colored content area */}
        <motion.div 
          className="hidden md:flex md:w-[45%] bg-brand-olive-400 relative overflow-hidden"
          style={{ y: isLoaded ? contentY : 0 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* Overlay content that spans both sections */}
      <motion.div 
        className="absolute inset-0 flex items-center z-10"
        style={{ opacity: isLoaded ? opacity : 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
          <div className="md:max-w-[55%] text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-brand-olive-200 text-lg uppercase tracking-wider font-brooklyn mb-2">
                Destination
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-brooklyn mb-6">
                {destination.name}
                <span className="block text-brand-olive-200 mt-2">{destination.country}</span>
              </h1>
              
              <p className="text-xl leading-relaxed font-brooklyn mb-8 max-w-2xl text-white/90">
                {destination.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <motion.a 
                  href="#hotels" 
                  className="inline-flex items-center justify-center text-white bg-transparent border border-white hover:bg-brand-olive-500 hover:border-brand-olive-500 transition-colors duration-300 rounded-full px-8 py-3 font-brooklyn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Hotels
                </motion.a>
                <motion.a 
                  href="#activities" 
                  className="inline-flex items-center justify-center text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-300 rounded-full px-8 py-3 font-brooklyn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discover Activities
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <p className="font-brooklyn text-sm mb-2">Scroll to Explore</p>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}