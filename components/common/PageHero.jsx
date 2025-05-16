'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PageHero({ 
  title, 
  subtitle,
  backgroundImage = '/images/hotels/hotel-3.jpg',
  overlayOpacity = 50
}) {
  return (
    <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className={`absolute inset-0 bg-black/${overlayOpacity}`}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}