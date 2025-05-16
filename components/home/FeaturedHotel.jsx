'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function FeaturedHotel({ 
  tag = "New to the Club",
  name = "the cōmodo",
  location = "Bad Gastein, Austria",
  description = "the cōmodo in Bad Gastein offers a midcentury-inspired retreat with farm-to-table dining, a full spa, and a curated art collection. Perfect for families and wellness enthusiasts.",
  slug = "the-comodo",
  images = [
    "/images/hotel-1.jpg",
    "/images/hotel-2.jpg",
    "/images/hotel-3.jpg"
  ]
}) {
  const [activeImage, setActiveImage] = useState(0);

  // Auto-slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7 }
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Content */}
          <motion.div variants={itemVariants}>
            {tag && (
              <div className="uppercase tracking-wider text-sm font-normal mb-4">
                {tag}
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
              {name}
            </h2>
            
            {location && (
              <div className="flex items-center text-gray-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{location}</span>
              </div>
            )}
            
            {description && (
              <p className="text-gray-700 mb-8 leading-relaxed font-light">
                {description}
              </p>
            )}
            
            <Link 
              href={`/hotels/${slug}`}
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              <span>Discover Hotel</span>
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
          </motion.div>
          
          {/* Image Gallery */}
          <motion.div 
            className="relative h-96 md:h-[500px] rounded-xl overflow-hidden"
            variants={itemVariants}
          >
            {images.map((image, index) => (
              <motion.div 
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  activeImage === index ? "opacity-100" : "opacity-0"
                )}
                variants={imageVariants}
              >
                <Image
                  src={image}
                  alt={`${name} - ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            ))}
            
            {/* Image Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    activeImage === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  )}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}