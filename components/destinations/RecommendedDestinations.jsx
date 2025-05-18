'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Normally this data would come from a database or API
const allDestinations = [
  {
    id: 1,
    name: "South Tyrol",
    country: "Italy",
    image: "/images/south-tyrol.jpg",
    slug: "south-tyrol"
  },
  {
    id: 2,
    name: "Amalfi Coast",
    country: "Italy",
    image: "/images/amalfi-coast.jpg",
    slug: "amalfi-coast"
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    image: "/images/santorini.jpg",
    slug: "santorini"
  },
  {
    id: 4,
    name: "Swiss Alps",
    country: "Switzerland",
    image: "/images/swiss-alps.jpg",
    slug: "swiss-alps"
  }
];

export default function RecommendedDestinations({ currentSlug }) {
  // Filter out the current destination and select max 3 recommendations
  const recommendations = allDestinations
    .filter(dest => dest.slug !== currentSlug)
    .slice(0, 3);
    
  // Animation variants
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

  if (recommendations.length === 0) return null;
  
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
          <h2 className="text-3xl md:text-4xl font-normal mb-4 font-brooklyn">
            More Destinations to Explore
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Continue your journey with these carefully selected destinations offering unique experiences and exceptional accommodations.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {recommendations.map(destination => (
            <motion.div key={destination.id} variants={item}>
              <Link 
                href={`/destinations/${destination.slug}`}
                className="group block relative h-[400px] rounded-xl overflow-hidden"
              >
                <Image
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm uppercase tracking-wider mb-1 font-brooklyn">{destination.country}</p>
                  <h3 className="text-2xl font-normal mb-2 font-brooklyn">{destination.name}</h3>
                  <span className="text-sm text-white/80 font-brooklyn inline-block py-2 px-4 bg-white/10 rounded-md group-hover:bg-brand-olive-400/80 transition-colors">
                    Explore Destination
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/destinations"
            className="inline-flex items-center px-8 py-3 border border-brand-olive-400 text-brand-olive-400 hover:bg-brand-olive-400 hover:text-white transition-colors rounded-md font-brooklyn"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}