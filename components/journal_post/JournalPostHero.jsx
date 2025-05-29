'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function JournalPostHero({ article }) {
  if (!article) return null;

  const {
    title,
    excerpt,
    images,
    categories = [],
    author,
    date
  } = article;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative h-[75vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={images?.main || '/images/journal/journal-1.png'}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
              {title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed">
              {excerpt}
            </p>
            
            {/* Author & Date */}
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20">
                <Image
                  src={author?.image || '/images/authors/default.jpg'}
                  alt={author?.name || 'Author'}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{author?.name}</p>
                <p className="text-sm text-white/60">{formattedDate}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="w-8 h-12 border border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}