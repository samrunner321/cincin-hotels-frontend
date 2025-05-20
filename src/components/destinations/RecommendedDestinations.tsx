'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Define the interface for a destination object
interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  slug: string;
  description?: string;
}

// Define the props for the component
interface RecommendedDestinationsProps {
  currentSlug?: string;
  destinations?: Destination[];
  title?: string;
  description?: string;
  limit?: number;
}

// Sample data for destinations (would normally come from an API or database)
const allDestinations: Destination[] = [
  {
    id: 1,
    name: "South Tyrol",
    country: "Italy",
    image: "/images/south-tyrol.jpg",
    slug: "south-tyrol",
    description: "Alpine beauty in Northern Italy"
  },
  {
    id: 2,
    name: "Amalfi Coast",
    country: "Italy",
    image: "/images/amalfi-coast.jpg",
    slug: "amalfi-coast",
    description: "Stunning Mediterranean coastline"
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    image: "/images/santorini.jpg",
    slug: "santorini",
    description: "Iconic island with blue domes"
  },
  {
    id: 4,
    name: "Swiss Alps",
    country: "Switzerland",
    image: "/images/swiss-alps.jpg",
    slug: "swiss-alps",
    description: "Majestic mountain landscapes"
  }
];

/**
 * RecommendedDestinations Component
 * 
 * Displays a grid of recommended destinations excluding the current one
 * with animated reveal and hover effects.
 */
export default function RecommendedDestinations({ 
  currentSlug,
  destinations = allDestinations,
  title = "More Destinations to Explore",
  description = "Continue your journey with these carefully selected destinations offering unique experiences and exceptional accommodations.",
  limit = 3
}: RecommendedDestinationsProps) {
  // Filter out the current destination and select limited recommendations
  const recommendations = destinations
    .filter(dest => dest.slug !== currentSlug)
    .slice(0, limit);
    
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

  // Don't render anything if there are no recommendations
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
            {title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            {description}
          </p>
        </motion.div>
        
        <motion.div 
          className={`grid grid-cols-1 md:grid-cols-${Math.min(recommendations.length, 3)} gap-6`}
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
                  {destination.description && (
                    <p className="text-sm text-white/90 mb-3 font-brooklyn">{destination.description}</p>
                  )}
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