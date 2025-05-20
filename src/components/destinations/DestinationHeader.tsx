import React from 'react';
'use client';

import { motion } from 'framer-motion';

export default function DestinationHeader({ destination }) {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <section 
      className="relative min-h-[70vh] md:min-h-[80vh] flex items-end pb-16 md:pb-24"
      style={{
        backgroundImage: `url(${destination.heroImage || destination.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px] relative z-10 text-white">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <p className="text-brand-olive-200 text-lg uppercase tracking-wider font-brooklyn mb-2">
            Destination
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 font-brooklyn">
            {destination.name}, <span className="text-brand-olive-200">{destination.country}</span>
          </h1>
          
          <p className="text-xl leading-relaxed font-brooklyn mb-4 text-white/90">
            {destination.description}
          </p>
          
          <div className="mt-8">
            <a 
              href="#hotels" 
              className="inline-flex items-center text-white bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors duration-300 rounded-md px-6 py-3 font-brooklyn mr-4"
            >
              View Hotels
            </a>
            <a 
              href="#about" 
              className="inline-flex items-center text-white hover:text-brand-olive-200 transition-colors duration-300 font-brooklyn"
            >
              Learn More
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}