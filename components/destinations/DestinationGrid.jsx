'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DestinationGrid() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Destinations' },
    { id: 'beach', name: 'Beaches' },
    { id: 'mountain', name: 'Mountains' },
    { id: 'city', name: 'Cities' },
    { id: 'countryside', name: 'Countryside' }
  ];
  
  const destinations = [
    {
      id: 1,
      name: "Santorini",
      country: "Greece",
      image: "/images/santorini.jpg",
      url: "/destinations/santorini",
      category: "beach"
    },
    {
      id: 2,
      name: "Dolomites",
      country: "Italy",
      image: "/images/dolomites.jpg",
      url: "/destinations/dolomites",
      category: "mountain"
    },
    {
      id: 3,
      name: "Paris",
      country: "France",
      image: "/images/paris.jpg",
      url: "/destinations/paris",
      category: "city"
    },
    {
      id: 4,
      name: "Provence",
      country: "France",
      image: "/images/countryside.jpg",
      url: "/destinations/provence",
      category: "countryside"
    },
    {
      id: 5,
      name: "Amalfi Coast",
      country: "Italy",
      image: "/images/amalfi-coast.jpg",
      url: "/destinations/amalfi-coast",
      category: "beach"
    },
    {
      id: 6,
      name: "Swiss Alps",
      country: "Switzerland",
      image: "/images/swiss-alps.jpg",
      url: "/destinations/swiss-alps",
      category: "mountain"
    },
    {
      id: 7,
      name: "Barcelona",
      country: "Spain",
      image: "/images/barcelona.jpg",
      url: "/destinations/barcelona",
      category: "city"
    },
    {
      id: 8,
      name: "Tuscany",
      country: "Italy",
      image: "/images/tuscany.jpg",
      url: "/destinations/tuscany",
      category: "countryside"
    }
  ];
  
  const filteredDestinations = activeCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <section id="destinations" className="py-16 bg-brand-olive-50/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">Explore Our Destinations</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            From pristine beaches to majestic mountains, vibrant cities to serene countryside retreats,
            discover the perfect backdrop for your next luxury experience.
          </p>
        </motion.div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-md font-brooklyn transition-colors ${
                activeCategory === category.id
                  ? 'bg-brand-olive-400 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-brand-olive-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Destinations Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {filteredDestinations.map(destination => (
            <motion.div key={destination.id} variants={item}>
              <Link 
                href={destination.url} 
                className="group block relative h-[350px] md:h-[400px] rounded-xl overflow-hidden"
              >
                <Image
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm uppercase tracking-wider mb-1 font-brooklyn">{destination.country}</p>
                  <h3 className="text-2xl font-normal mb-1 font-brooklyn">{destination.name}</h3>
                  <div className="w-10 h-0.5 bg-brand-olive-400 mt-2 mb-2 transform origin-left transition-all duration-300 group-hover:w-16"></div>
                  <p className="text-white/80 text-sm opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 font-brooklyn">
                    Explore destination
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}