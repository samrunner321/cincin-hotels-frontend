'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PopularDestinations({ 
  title = "Popular Destinations",
  featuredDestinations = [
    {
      id: 1,
      name: "South Tyrol",
      country: "Italy",
      description: "Alpine beauty with Dolomite peaks, charming villages, and exceptional cuisine.",
      image: "/images/south-tyrol.jpg",
      url: "/destinations/south-tyrol"
    },
    {
      id: 2,
      name: "Bretagne",
      country: "France",
      description: "Rugged coastlines, medieval towns, and a rich maritime heritage.",
      image: "/images/bretagne.jpg",
      url: "/destinations/bretagne"
    }
  ],
  hotels = [
    {
      id: 1,
      name: "Schgaguler Hotel",
      image: "/images/hotel-schgaguler.jpg",
      url: "/hotels/schgaguler-hotel"
    },
    {
      id: 2,
      name: "Rockresort",
      image: "/images/hotel-rockresort.jpg",
      url: "/hotels/rockresort"
    },
    {
      id: 3,
      name: "Giardino Mountain",
      image: "/images/hotel-giardino.jpg",
      url: "/hotels/giardino-mountain"
    },
    {
      id: 4,
      name: "Aurora Spa Villas",
      image: "/images/hotel-aurora.jpg",
      url: "/hotels/aurora-spa-villas"
    }
  ]
}) {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-normal font-brooklyn text-gray-900">
            {title}
          </h2>
        </motion.div>

        {/* Featured Destinations - Two Columns */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          {featuredDestinations.map((destination) => (
            <motion.div key={destination.id} variants={itemFadeIn}>
              <Link
                href={destination.url}
                className="group block overflow-hidden rounded-xl"
              >
                <div className="relative h-60 md:h-80 w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <p className="text-brand-olive-200 text-sm uppercase tracking-wider font-brooklyn mb-1">
                      {destination.country}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-normal font-brooklyn mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base font-brooklyn mb-3 max-w-md">
                      {destination.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-brooklyn">
                      Explore
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                        viewBox="0 0 25 9" 
                        fill="none"
                      >
                        <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Hotels Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {hotels.map((hotel) => (
            <motion.div key={hotel.id} variants={itemFadeIn}>
              <Link 
                href={hotel.url}
                className="group relative block h-48 rounded-xl overflow-hidden"
              >
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-white">
                  <h5 className="text-xl font-normal font-brooklyn">{hotel.name}</h5>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link 
            href="/destinations" 
            className="inline-flex items-center px-6 py-3 border border-brand-olive-400 text-brand-olive-400 hover:bg-brand-olive-400 hover:text-white transition-colors rounded-md font-brooklyn"
          >
            View All Destinations
          </Link>
        </div>
      </div>
    </section>
  );
}