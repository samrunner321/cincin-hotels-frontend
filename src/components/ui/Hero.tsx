'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroSectionProps } from '../../types/pages';

/**
 * Hero component for page headers with background image
 */
const Hero: React.FC<HeroSectionProps> = ({
  title,
  description,
  backgroundImage = '/images/hero-bg.jpg',
  buttons = []
}) => {
  // Animation variants
  const variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.2 
      }
    }
  };

  const itemVariants = {
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

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImage} 
          alt={title || 'Hero image'}
          fill 
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-20 text-center"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        {title && (
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-brooklyn mb-6"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
        )}
        
        {description && (
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
        
        {buttons.length > 0 && (
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            {buttons.map((button, index) => (
              <Link 
                key={index}
                href={button.href}
                className={`px-8 py-3 ${
                  button.primary 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : 'border border-white hover:bg-white/20'
                } transition-colors rounded-full font-medium`}
                aria-label={button.text}
              >
                {button.text}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;