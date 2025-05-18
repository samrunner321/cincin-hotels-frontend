'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturedDestination() {
  const [activeIdx, setActiveIdx] = useState(0);
  
  const destinations = [
    {
      id: 1,
      name: "South Tyrol, Italy",
      description: "Nestled in the northernmost part of Italy, South Tyrol is a dreamlike landscape of jagged Dolomite peaks, rolling hills dotted with vineyards, and charming villages where Alpine and Mediterranean cultures blend seamlessly.",
      image: "/images/south-tyrol.jpg",
      hotels: 8,
      url: "/destinations/south-tyrol"
    },
    {
      id: 2,
      name: "Amalfi Coast, Italy",
      description: "The Amalfi Coast is a stunning stretch of coastline along the southern edge of Italy's Sorrentine Peninsula, renowned for its rugged terrain, scenic beauty, pastel-colored fishing villages, and cliff-side lemon groves.",
      image: "/images/amalfi-coast.jpg",
      hotels: 12,
      url: "/destinations/amalfi-coast"
    },
    {
      id: 3, 
      name: "Santorini, Greece",
      description: "Santorini is a volcanic island in the Cyclades group of the Greek islands known for its dramatic views, stunning sunsets, white-washed houses, and brilliant blue-domed churches perched on caldera cliffs.",
      image: "/images/santorini.jpg",
      hotels: 10,
      url: "/destinations/santorini"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % destinations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [destinations.length]);

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
    <section className="py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">Featured Destinations</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Discover our handpicked selection of the most breathtaking destinations, each offering unique experiences and carefully curated accommodations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Selector Buttons */}
          <div className="lg:col-span-1">
            {destinations.map((dest, idx) => (
              <button
                key={dest.id}
                onClick={() => setActiveIdx(idx)}
                className={`text-left w-full py-4 px-6 mb-4 rounded-lg transition-all ${
                  idx === activeIdx 
                    ? 'bg-brand-olive-50 border-l-4 border-brand-olive-400' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <h3 className={`text-xl font-brooklyn mb-1 ${
                  idx === activeIdx ? 'text-brand-olive-600' : 'text-gray-700'
                }`}>
                  {dest.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {dest.hotels} Hotels
                </p>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 relative overflow-hidden rounded-xl">
            {destinations.map((dest, idx) => (
              <div 
                key={dest.id}
                className={`transition-opacity duration-500 ${
                  idx === activeIdx ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <div className="relative h-[300px] md:h-[500px] rounded-xl overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                  <h3 className="text-2xl md:text-3xl font-normal font-brooklyn mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-white/90 mb-6 max-w-2xl font-brooklyn">
                    {dest.description}
                  </p>
                  <Link
                    href={dest.url}
                    className="inline-flex items-center text-white bg-transparent border border-white hover:bg-brand-olive-400 hover:border-brand-olive-400 transition-colors duration-300 rounded-md px-6 py-3 font-brooklyn"
                  >
                    <span>Explore {dest.name.split(',')[0]}</span>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}