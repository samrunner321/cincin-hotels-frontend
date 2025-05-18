'use client';

import { motion } from 'framer-motion';

export default function DestinationsHero() {
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
      className="relative min-h-[70vh] md:min-h-[60vh] flex items-center"
      style={{
        backgroundImage: `url(/images/destinations-hero.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px] relative z-10 text-white">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 font-brooklyn">
            Destinations
          </h1>
          
          <p className="text-xl md:text-2xl leading-relaxed font-brooklyn mb-6">
            Discover unique destinations across the globe, each with its own charm, 
            culture, and carefully selected accommodations.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#beach" className="px-6 py-3 bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors rounded-md">
              Beaches
            </a>
            <a href="#mountains" className="px-6 py-3 bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors rounded-md">
              Mountains
            </a>
            <a href="#cities" className="px-6 py-3 bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors rounded-md">
              Cities
            </a>
            <a href="#countryside" className="px-6 py-3 bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors rounded-md">
              Countryside
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}