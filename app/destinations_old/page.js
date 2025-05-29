'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for destinations
const destinations = [
  {
    id: 1,
    name: 'Mykonos',
    slug: 'mykonos',
    country: 'Greece',
    continent: 'Europe',
    type: ['beach', 'island'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'A Cycladic paradise with stunning Aegean views, iconic windmills, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
    isFeatured: true,
    bestTime: 'May - September',
    temperature: '25-30°C'
  },
  {
    id: 2,
    name: 'Crans-Montana',
    slug: 'crans-montana',
    country: 'Switzerland',
    continent: 'Europe',
    type: ['mountain', 'ski'],
    climate: 'Alpine',
    region: 'Alps',
    description: 'A prestigious Alpine resort offering panoramic mountain views, world-class skiing, and championship golf courses.',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    isFeatured: true,
    bestTime: 'December - March',
    temperature: '-5 to 10°C'
  },
  {
    id: 3,
    name: 'South Tyrol',
    slug: 'south-tyrol',
    country: 'Italy',
    continent: 'Europe',
    type: ['mountain', 'countryside'],
    climate: 'Alpine-Mediterranean',
    region: 'Alps',
    description: 'A unique blend of Alpine and Mediterranean cultures with breathtaking Dolomite landscapes and award-winning cuisine.',
    image: 'https://images.unsplash.com/photo-1523478354461-4cd1a7b97677?w=800&q=80',
    isFeatured: true,
    bestTime: 'June - October',
    temperature: '15-25°C'
  },
  {
    id: 4,
    name: 'Berlin',
    slug: 'berlin',
    country: 'Germany',
    continent: 'Europe',
    type: ['city'],
    climate: 'Continental',
    region: 'Central Europe',
    description: 'A dynamic city blending rich history with cutting-edge creativity and vibrant cultural scenes.',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80',
    isFeatured: false,
    bestTime: 'May - September',
    temperature: '15-25°C'
  },
  {
    id: 5,
    name: 'Santorini',
    slug: 'santorini',
    country: 'Greece',
    continent: 'Europe',
    type: ['beach', 'island'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'Iconic white-washed buildings, breathtaking sunsets, and volcanic beaches.',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    isFeatured: true,
    bestTime: 'April - October',
    temperature: '20-28°C'
  },
  {
    id: 6,
    name: 'Tuscany',
    slug: 'tuscany',
    country: 'Italy',
    continent: 'Europe',
    type: ['countryside'],
    climate: 'Mediterranean',
    region: 'Mediterranean',
    description: 'Rolling hills, historic villages, world-class wines, and Renaissance art.',
    image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
    isFeatured: false,
    bestTime: 'April - October',
    temperature: '15-28°C'
  }
];

// Filter categories
const typeFilters = [
  { id: 'all', name: 'All Destinations', icon: '🌍' },
  { id: 'beach', name: 'Beach', icon: '🏖️' },
  { id: 'mountain', name: 'Mountain', icon: '⛰️' },
  { id: 'city', name: 'City', icon: '🏙️' },
  { id: 'countryside', name: 'Countryside', icon: '🌾' },
  { id: 'island', name: 'Island', icon: '🏝️' }
];

const continentFilters = [
  { id: 'all', name: 'All Continents' },
  { id: 'Europe', name: 'Europe' },
  { id: 'Asia', name: 'Asia' },
  { id: 'Americas', name: 'Americas' },
  { id: 'Africa', name: 'Africa' }
];

const climateFilters = [
  { id: 'all', name: 'All Climates' },
  { id: 'Mediterranean', name: 'Mediterranean' },
  { id: 'Alpine', name: 'Alpine' },
  { id: 'Tropical', name: 'Tropical' },
  { id: 'Continental', name: 'Continental' }
];

// Destination Card Component
const DestinationCard = ({ destination, index }) => {
  return (
    <motion.div 
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/destinations/${destination.slug}`}>
        <div className="relative h-72 overflow-hidden">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {destination.isFeatured && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
              Featured
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-brooklyn text-white mb-1">{destination.name}</h3>
            <p className="text-white/90 text-sm">{destination.country} • {destination.region}</p>
          </div>
        </div>
        
        <div className="p-6 bg-white">
          <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {destination.bestTime}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                {destination.temperature}
              </span>
            </div>
          </div>
          
          <span className="text-brand-olive-400 font-brooklyn inline-flex items-center group-hover:gap-3 transition-all">
            Explore
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 8H15M15 8L8.5 1.5M15 8L8.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default function DestinationsPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [continentFilter, setContinentFilter] = useState('all');
  const [climateFilter, setClimateFilter] = useState('all');
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [showFilters, setShowFilters] = useState(false);

  // Filter destinations
  useEffect(() => {
    let filtered = destinations;
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(dest => dest.type.includes(typeFilter));
    }
    
    if (continentFilter !== 'all') {
      filtered = filtered.filter(dest => dest.continent === continentFilter);
    }
    
    if (climateFilter !== 'all') {
      filtered = filtered.filter(dest => dest.climate === climateFilter);
    }
    
    setFilteredDestinations(filtered);
  }, [typeFilter, continentFilter, climateFilter]);

  // Random destination function
  const discoverRandom = () => {
    const randomIndex = Math.floor(Math.random() * destinations.length);
    window.location.href = `/destinations/${destinations[randomIndex].slug}`;
  };

  return (
    <main className="pt-24 pb-16">
      {/* Enhanced Hero Section with Parallax */}
      <motion.div 
        className="relative h-[60vh] min-h-[500px] mb-12 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt="Destinations"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50"></div>
        
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <motion.div 
            className="max-w-4xl p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-brooklyn text-white mb-6">
              <span className="font-light">Discover</span> <span className="font-bold">Destinations</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Explore the most beautiful destinations around the world, curated specifically for the discerning traveler.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter Destinations
              </button>
              
              <button
                onClick={discoverRandom}
                className="bg-brand-olive-400 text-white px-8 py-3 rounded-full hover:bg-brand-olive-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Discover Random
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="container mx-auto px-4 mb-12"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
              {/* Type Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Destination Type</h3>
                <div className="flex flex-wrap gap-3">
                  {typeFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setTypeFilter(filter.id)}
                      className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                        typeFilter === filter.id
                          ? 'bg-brand-olive-400 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{filter.icon}</span>
                      <span className="text-sm">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Continent Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Continent</h3>
                <div className="flex flex-wrap gap-3">
                  {continentFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setContinentFilter(filter.id)}
                      className={`px-4 py-2 rounded-full transition-all text-sm ${
                        continentFilter === filter.id
                          ? 'bg-brand-olive-400 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Climate Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Climate</h3>
                <div className="flex flex-wrap gap-3">
                  {climateFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setClimateFilter(filter.id)}
                      className={`px-4 py-2 rounded-full transition-all text-sm ${
                        climateFilter === filter.id
                          ? 'bg-brand-olive-400 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              {(typeFilter !== 'all' || continentFilter !== 'all' || climateFilter !== 'all') && (
                <button
                  onClick={() => {
                    setTypeFilter('all');
                    setContinentFilter('all');
                    setClimateFilter('all');
                  }}
                  className="text-sm text-brand-olive-400 hover:text-brand-olive-600 transition-colors"
                >
                  Reset all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="container mx-auto px-4 mb-8">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredDestinations.length}</span> destinations
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination, index) => (
            <DestinationCard key={destination.id} destination={destination} index={index} />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No destinations found matching your filters.</p>
            <button
              onClick={() => {
                setTypeFilter('all');
                setContinentFilter('all');
                setClimateFilter('all');
              }}
              className="mt-4 text-brand-olive-400 hover:text-brand-olive-600 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}