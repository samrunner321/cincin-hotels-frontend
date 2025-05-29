'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function DestinationHero({ 
  destinationName = "Mykonos", 
  country = "Greece", 
  description = "A Cycladic paradise with stunning Aegean views, iconic windmills, and vibrant nightlife.",
  backgroundImage = "/images/destinations/beach.jpg",
  accentColor = "#93A27F",
  exploreButtonText = "Explore Destination"
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Setup parallax scroll effects
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handle smooth scroll when clicking the "explore" button
  const handleExploreClick = () => {
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flex flex-col md:flex-row h-[68vh] w-full relative overflow-hidden">
      {/* Background container with full-width design */}
      <div className="absolute inset-0 flex w-full h-full">
        {/* Left side - Image (55%) */}
        <motion.div 
          className="relative w-[55%] h-full overflow-hidden"
          style={{ y: isLoaded ? imageY : 0 }}
        >
          <Image
            src={backgroundImage}
            alt={`${destinationName}, ${country}`}
            fill
            priority
            className="object-cover"
            sizes="55vw"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
        
        {/* Right side - Colored background (45%) */}
        <div 
          className="w-[45%] h-full relative overflow-hidden"
          style={{ backgroundColor: accentColor }}
        >
        </div>
      </div>
      
      {/* Content container with maximum width */}
      <div className="relative flex flex-col md:flex-row w-full h-full max-w-[1814px] mx-auto z-10">
        {/* Empty left side for image only */}
        <div className="w-full md:w-[55%] h-2/3 md:h-full"></div>
        
        {/* Text content for the right side */}
        <motion.div 
          className="w-full md:w-[45%] h-1/3 md:h-full flex flex-col justify-end p-8 md:p-12 lg:p-16"
          style={{ y: isLoaded ? contentY : 0 }}
        >
          <div className="max-w-md lg:max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-brooklyn font-normal text-white mb-4">{destinationName}</h1>
              <p className="text-white/80 mb-8">{description}</p>
              <motion.button 
                onClick={handleExploreClick}
                className="inline-flex items-center text-white hover:text-gray-200 transition-all"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{exploreButtonText}</span>
                <svg className="ml-3" xmlns="http://www.w3.org/2000/svg" width="25" height="9" viewBox="0 0 25 9" fill="none">
                  <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 1 }
        }}
      >
        <motion.div 
          className="flex flex-col items-center cursor-pointer"
          animate={{ 
            y: [0, 8, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
          onClick={handleExploreClick}
        >
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="white" strokeWidth="2"/>
            <motion.circle 
              cx="10" 
              cy="10" 
              r="4" 
              fill="white"
              animate={{ y: [0, 10, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}