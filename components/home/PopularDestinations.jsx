'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PopularDestinations({ 
  title = "Popular Destinations",
  featured = {
    name: "South Tyrol",
    image: "/images/south-tyrol.jpg",
    url: "/destinations/south-tyrol"
  },
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

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900">
            {title}
          </h2>
        </div>

        {/* Featured Destination - South Tyrol */}
        <div className="mb-6">
          <Link
            href={featured.url}
            className="relative block h-48 rounded-xl overflow-hidden"
          >
            <div className="h-full w-full">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-white text-3xl md:text-4xl font-normal">{featured.name}</h3>
            </div>
          </Link>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <Link 
              key={hotel.id}
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
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <h5 className="text-white text-xl font-normal">{hotel.name}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}