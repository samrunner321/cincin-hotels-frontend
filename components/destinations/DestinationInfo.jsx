'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DestinationInfo({ destination }) {
  const [activeImage, setActiveImage] = useState(0);
  
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

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Column - Content */}
          <motion.div 
            className="lg:col-span-6 lg:sticky lg:top-24"
            variants={itemVariants}
          >
            <h2 className="text-3xl md:text-4xl font-normal mb-6 font-brooklyn">
              About {destination.name}
            </h2>
            
            <div className="prose prose-lg max-w-none font-brooklyn space-y-4">
              {destination.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-brooklyn mb-4">Activities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {destination.activities.map((activity, index) => (
                  <li key={index} className="flex items-start font-brooklyn text-gray-700 mb-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-brand-olive-400 mt-0.5 mr-2 flex-shrink-0" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-brooklyn mb-2">Best Time to Visit</h3>
              <p className="text-gray-700 font-brooklyn">{destination.bestTimeToVisit}</p>
            </div>
          </motion.div>
          
          {/* Right Column - Image Gallery */}
          <motion.div 
            className="lg:col-span-6"
            variants={itemVariants}
          >
            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-4">
              {destination.imageGallery && destination.imageGallery.map((image, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeImage ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${destination.name} - ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="flex space-x-3">
              {destination.imageGallery && destination.imageGallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 relative rounded-md overflow-hidden border-2 transition-all ${
                    index === activeImage ? 'border-brand-olive-400 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${destination.name} thumbnail ${index + 1}`}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}