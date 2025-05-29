'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';

export default function HotelsSection({ 
  destination, 
  hotels: propHotels,
  viewDetailsText = 'View Details',
  showMoreText = 'Show More',
  showLessText = 'Show Less'
}) {
  const [showAll, setShowAll] = useState(false);
  const { t, locale } = useTranslation();
  
  // Use real hotels data from props, or fall back to mock data
  const hotels = propHotels && propHotels.length > 0 ? propHotels : [
    {
      id: 1,
      name: 'Belvedere Hotel',
      type: 'luxury',
      description: 'Five-star luxury with panoramic views and world-class spa facilities.',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
      price: 'From €450/night',
      rating: 4.9,
      amenities: ['Spa', 'Pool', 'Restaurant', 'Beach Access']
    },
    {
      id: 2,
      name: 'Boutique Mykonos',
      type: 'boutique',
      description: 'Intimate boutique property with authentic Cycladic architecture.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      price: 'From €280/night',
      rating: 4.7,
      amenities: ['Pool', 'Restaurant', 'Bar']
    },
    {
      id: 3,
      name: 'Seaside Resort',
      type: 'resort',
      description: 'All-inclusive beachfront resort perfect for families.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      price: 'From €320/night',
      rating: 4.6,
      amenities: ['Beach', 'Kids Club', 'Multiple Restaurants', 'Water Sports']
    },
    {
      id: 4,
      name: 'Design Hotel',
      type: 'design',
      description: 'Contemporary design hotel in the heart of the old town.',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      price: 'From €350/night',
      rating: 4.8,
      amenities: ['Rooftop Bar', 'Gym', 'Business Center']
    }
  ];

  // Map real hotel data to component format
  const mappedHotels = hotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    type: hotel.categories?.[0]?.toLowerCase() || 'luxury',
    description: hotel.description,
    image: hotel.images?.[0] || hotel.image || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    price: hotel.price ? `From €${hotel.price.amount || hotel.price}/night` : 'Price on request',
    rating: hotel.rating || 4.5,
    amenities: hotel.amenities || [],
    slug: hotel.slug
  }));

  const filteredHotels = mappedHotels;

  return (
    <section id="hotels" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-12">
            Hotels in <span className="font-bold">{destination}</span>
          </h2>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredHotels.slice(0, showAll ? filteredHotels.length : 3).map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  layout
                >
                  <div className="relative h-64">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                    
                    <div className="flex justify-end">
                      <Link 
                        href={`/${locale}/hotels/${hotel.slug || hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-brand-olive-400 hover:text-brand-olive-600 transition-colors flex items-center gap-1"
                      >
                        {viewDetailsText}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Show More/Less Button */}
          {filteredHotels.length > 3 && (
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-gray-600 hover:text-black transition-colors text-sm font-light underline underline-offset-4"
              >
                {showAll ? (
                  showLessText
                ) : (
                  `${showMoreText} (${filteredHotels.length - 3})`
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}