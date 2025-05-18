'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function DestinationExplorer() {
  const [activeView, setActiveView] = useState('map'); // 'map', 'globe', 'list'
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('europe');
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const globeRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  
  const regions = {
    europe: {
      name: 'Europe',
      description: 'From the sun-drenched Mediterranean to the Alpine peaks, Europe offers a rich tapestry of cultures, landscapes, and experiences.',
      position: { x: '60%', y: '40%' },
      destinations: [
        {
          id: 'crans-montana',
          name: 'Crans-Montana',
          country: 'Switzerland',
          type: 'mountain',
          description: 'A sun-drenched Alpine playground with stunning panoramic views.',
          image: '/images/hotels/hotel-1.jpg'
        },
        {
          id: 'south-tyrol',
          name: 'South Tyrol',
          country: 'Italy',
          type: 'mountain',
          description: 'A dreamlike landscape of jagged Dolomite peaks and charming villages.',
          image: '/images/hotels/hotel-2.jpg'
        },
        {
          id: 'amalfi-coast',
          name: 'Amalfi Coast',
          country: 'Italy',
          type: 'beach',
          description: 'Dramatic coastal scenery with pastel-colored villages perched on cliffs.',
          image: '/images/hotels/hotel-3.jpg'
        },
        {
          id: 'paris',
          name: 'Paris',
          country: 'France',
          type: 'city',
          description: 'The City of Light, renowned for its culture, cuisine, and iconic landmarks.',
          image: '/images/hotels/hotel-4.jpg'
        }
      ]
    },
    mediterranean: {
      name: 'Mediterranean',
      description: 'Crystalline waters, golden beaches, and a rich historical tapestry define the Mediterranean basin.',
      position: { x: '55%', y: '46%' },
      destinations: [
        {
          id: 'santorini',
          name: 'Santorini',
          country: 'Greece',
          type: 'beach',
          description: 'Volcanic island known for dramatic views and stunning white-washed villages.',
          image: '/images/hotels/hotel-5.jpg'
        },
        {
          id: 'mallorca',
          name: 'Mallorca',
          country: 'Spain',
          type: 'beach',
          description: 'Balearic gem with secluded coves, mountain views, and rich cultural heritage.',
          image: '/images/hotels/hotel-6.jpg'
        },
        {
          id: 'malta',
          name: 'Malta',
          country: 'Malta',
          type: 'beach',
          description: 'Historical island nation with honey-colored architecture and blue lagoons.',
          image: '/images/hotels/hotel-7.jpg'
        }
      ]
    },
    alps: {
      name: 'The Alps',
      description: 'Majestic peaks, pristine lakes, and charming alpine villages create a year-round playground for outdoor enthusiasts.',
      position: { x: '52%', y: '42%' },
      destinations: [
        {
          id: 'zermatt',
          name: 'Zermatt',
          country: 'Switzerland',
          type: 'mountain',
          description: 'Car-free mountain resort with views of the iconic Matterhorn peak.',
          image: '/images/hotels/hotel-1.jpg'
        },
        {
          id: 'chamonix',
          name: 'Chamonix',
          country: 'France',
          type: 'mountain',
          description: 'Legendary alpine playground nestled beneath Mont Blanc, Europe\'s highest peak.',
          image: '/images/hotels/hotel-2.jpg'
        },
        {
          id: 'dolomites',
          name: 'Dolomites',
          country: 'Italy',
          type: 'mountain',
          description: 'UNESCO-protected mountain range with distinctive limestone formations.',
          image: '/images/hotels/hotel-3.jpg'
        }
      ]
    },
    nordics: {
      name: 'Nordic Countries',
      description: 'Land of the midnight sun, dramatic fjords, and innovative design, offering wilderness adventures and urban sophistication.',
      position: { x: '58%', y: '32%' },
      destinations: [
        {
          id: 'norwegian-fjords',
          name: 'Norwegian Fjords',
          country: 'Norway',
          type: 'mountain',
          description: 'Dramatic landscapes with steep mountainsides and deep blue waters.',
          image: '/images/hotels/hotel-4.jpg'
        },
        {
          id: 'copenhagen',
          name: 'Copenhagen',
          country: 'Denmark',
          type: 'city',
          description: 'Design-forward city with colorful harbor buildings and hygge culture.',
          image: '/images/hotels/hotel-5.jpg'
        },
        {
          id: 'lapland',
          name: 'Lapland',
          country: 'Finland',
          type: 'countryside',
          description: 'Arctic wonderland with Northern Lights, reindeer, and glass igloos.',
          image: '/images/hotels/hotel-6.jpg'
        }
      ]
    }
  };

  // Create 3D globe effect with mouse movement
  useEffect(() => {
    if (!globeRef.current || activeView !== 'globe') return;
    
    const handleMouseMove = (e) => {
      const rect = globeRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center in percentage
      const distX = (e.clientX - centerX) / (rect.width / 2);
      const distY = (e.clientY - centerY) / (rect.height / 2);
      
      // Apply rotation based on mouse position (limited range)
      setRotationY(distX * 15); // Max 15 degrees rotation
      setRotationX(-distY * 15); // Inverted for natural feel
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeView]);

  // Pulse animation for the map hotspots
  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop'
      }
    }
  };

  // Animation for destinations cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    }),
    hover: {
      y: -10,
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3
      }
    }
  };

  // Get destinations based on selected region
  const currentDestinations = regions[selectedRegion]?.destinations || [];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-4">Discover Our World</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Explore our curated collection of exceptional destinations spanning continents and cultures. 
            Find your next adventure using our interactive discovery tools.
          </p>
          
          {/* View Selector */}
          <div className="flex flex-wrap justify-center mt-8 gap-3">
            <button 
              onClick={() => setActiveView('map')}
              className={`px-5 py-2.5 rounded-full font-brooklyn transition-all ${
                activeView === 'map' 
                  ? 'bg-brand-olive-400 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7M9 20V7m0 13l6-3m-6-13l6-3m6 13V7m0 13l-5.447-2.724A1 1 0 0 1 15 16.382V5.618a1 1 0 0 1 1.447-.894L21 7" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Interactive Map
              </span>
            </button>
            <button 
              onClick={() => setActiveView('globe')}
              className={`px-5 py-2.5 rounded-full font-brooklyn transition-all ${
                activeView === 'globe' 
                  ? 'bg-brand-olive-400 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                3D Globe View
              </span>
            </button>
            <button 
              onClick={() => setActiveView('list')}
              className={`px-5 py-2.5 rounded-full font-brooklyn transition-all ${
                activeView === 'list' 
                  ? 'bg-brand-olive-400 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                List View
              </span>
            </button>
          </div>
        </motion.div>
        
        {/* Interactive Map View */}
        {activeView === 'map' && (
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden"
            >
              {/* World Map */}
              <div className="relative aspect-[16/9] bg-brand-olive-50">
                <Image
                  src="/images/misc/world-map.webp"
                  alt="World Map"
                  fill
                  className="object-cover opacity-90"
                />
                
                {/* Region Hotspots */}
                {Object.entries(regions).map(([id, region]) => (
                  <motion.div
                    key={id}
                    initial="idle"
                    animate="pulse"
                    variants={pulseVariants}
                    className={`absolute cursor-pointer z-10`}
                    style={{ 
                      left: region.position.x, 
                      top: region.position.y,
                    }}
                    onClick={() => setSelectedRegion(id)}
                    onMouseEnter={() => setHoveredRegion(id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <div className={`relative flex items-center justify-center ${
                      selectedRegion === id ? 'scale-150' : 'scale-100'
                    }`}>
                      <div className={`w-5 h-5 rounded-full ${
                        selectedRegion === id 
                          ? 'bg-brand-olive-400' 
                          : 'bg-white border-2 border-brand-olive-400'
                      }`}></div>
                      {selectedRegion === id && (
                        <div className="animate-ping absolute w-5 h-5 rounded-full bg-brand-olive-400 opacity-75"></div>
                      )}
                    </div>
                    
                    {/* Tooltip on hover */}
                    {(hoveredRegion === id || selectedRegion === id) && (
                      <div className={`absolute z-20 w-48 bg-white rounded-lg shadow-lg p-3 transform -translate-x-1/2 pointer-events-none ${
                        selectedRegion === id ? 'bottom-full mb-3' : 'top-full mt-3'
                      }`}>
                        <h4 className="font-brooklyn text-brand-olive-400 text-sm mb-1">{region.name}</h4>
                        {selectedRegion === id && (
                          <p className="text-xs text-gray-600 font-brooklyn">{region.description}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Destinations Grid for Selected Region */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-brooklyn mb-2">
                {regions[selectedRegion]?.name} Destinations
              </h3>
              <p className="text-gray-600 mb-8 font-brooklyn max-w-4xl">
                {regions[selectedRegion]?.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentDestinations.map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={cardVariants}
                  >
                    <Link href={`/destinations/${dest.id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <div className="relative h-52 overflow-hidden">
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-brooklyn text-gray-700 z-10">
                            {dest.type === 'beach' && '🏖️ Beach'}
                            {dest.type === 'mountain' && '⛰️ Mountain'}
                            {dest.type === 'city' && '🏙️ City'}
                            {dest.type === 'countryside' && '🌄 Countryside'}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <p className="text-brand-olive-400 text-sm font-brooklyn">{dest.country}</p>
                          <h4 className="text-lg font-brooklyn mb-2">{dest.name}</h4>
                          <p className="text-gray-600 text-sm flex-grow">{dest.description}</p>
                          <div className="mt-4 flex items-center text-brand-olive-400 text-sm font-brooklyn">
                            <span>Discover more</span>
                            <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Coming Soon Teaser */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-12 bg-brand-olive-50/50 rounded-xl p-8 text-center"
              >
                <h4 className="text-xl font-brooklyn mb-3">More Destinations Coming Soon</h4>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  Our collection of extraordinary places is constantly growing. Sign up for our newsletter to be the first to know when we add new destinations.
                </p>
                <Link href="/newsletter" className="inline-block px-6 py-3 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors">
                  Join Our Newsletter
                </Link>
              </motion.div>
            </motion.div>
          </div>
        )}
        
        {/* 3D Globe View */}
        {activeView === 'globe' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-10 items-center"
          >
            <div className="lg:w-1/2">
              <div 
                ref={globeRef}
                className="relative aspect-square max-w-[500px] mx-auto perspective-1000"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <motion.div
                  className="w-full h-full rounded-full overflow-hidden"
                  style={{
                    transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out'
                  }}
                >
                  <Image
                    src="/images/misc/world-map.webp"
                    alt="Globe View"
                    fill
                    className="object-cover"
                    style={{
                      borderRadius: '50%',
                    }}
                  />
                  
                  {/* Interactive hint */}
                  <motion.div 
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-gray-800 pointer-events-none"
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      y: [0, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  >
                    <span className="font-brooklyn">Move your mouse to rotate</span>
                  </motion.div>
                  
                  {/* Region Markers */}
                  {Object.entries(regions).map(([id, region]) => {
                    // Convert position from percentage to coordinates on sphere
                    const x = (parseFloat(region.position.x) - 50) / 100;
                    const y = (parseFloat(region.position.y) - 50) / 100;
                    const r = 0.48; // radius slightly smaller than 0.5 to keep points on the visible sphere
                    
                    // Simple conversion to 3D coordinates (approximation)
                    const phi = x * Math.PI;
                    const theta = y * Math.PI;
                    
                    // Calculate 3D position
                    const left = `calc(50% + ${Math.sin(phi) * r * 100}%)`;
                    const top = `calc(50% + ${-Math.cos(theta) * r * 100}%)`;
                    const zIndex = Math.sin(phi) > 0 ? 10 : 1;
                    
                    return (
                      <motion.div
                        key={id}
                        className="absolute w-4 h-4 cursor-pointer"
                        style={{
                          left,
                          top,
                          zIndex,
                          transformStyle: 'preserve-3d',
                        }}
                        onClick={() => setSelectedRegion(id)}
                        whileHover={{ scale: 1.5 }}
                      >
                        <div className={`w-full h-full rounded-full ${
                          selectedRegion === id ? 'bg-brand-olive-400' : 'bg-white border-2 border-brand-olive-400'
                        }`}></div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4 font-brooklyn">
                Click on a region to explore its destinations
              </p>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-brooklyn mb-3">
                  {regions[selectedRegion]?.name}
                </h3>
                <p className="text-gray-600 mb-6 font-brooklyn">
                  {regions[selectedRegion]?.description}
                </p>
                
                <div className="space-y-4">
                  {currentDestinations.map((dest, index) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden flex h-24"
                    >
                      <div className="relative w-24 h-full">
                        <Image
                          src={dest.image}
                          alt={dest.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow p-3 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-brand-olive-400 font-brooklyn">{dest.country}</p>
                          <h4 className="text-gray-900 font-brooklyn">{dest.name}</h4>
                        </div>
                        <Link 
                          href={`/destinations/${dest.id}`}
                          className="text-brand-olive-400 text-xs font-brooklyn flex items-center self-end"
                        >
                          Explore
                          <svg className="w-3 h-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* List View */}
        {activeView === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Region Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {Object.entries(regions).map(([id, region]) => (
                <button
                  key={id}
                  onClick={() => setSelectedRegion(id)}
                  className={`px-5 py-2.5 rounded-md font-brooklyn transition-all ${
                    selectedRegion === id 
                      ? 'bg-brand-olive-400 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
            
            {/* Selected Region Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h3 className="text-2xl md:text-3xl font-brooklyn mb-3">{regions[selectedRegion]?.name}</h3>
              <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
                {regions[selectedRegion]?.description}
              </p>
            </motion.div>
            
            {/* Creative Destination Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {currentDestinations.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className={`${
                    index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <Link href={`/destinations/${dest.id}`}>
                    <div className={`group relative rounded-xl overflow-hidden ${
                      index === 0 ? 'h-full min-h-[400px]' : 'h-[300px]'
                    }`}>
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-brooklyn text-gray-700 z-10">
                        {dest.country}
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h4 className={`font-brooklyn mb-2 ${
                          index === 0 ? 'text-2xl' : 'text-xl'
                        }`}>{dest.name}</h4>
                        <p className={`text-white/90 font-brooklyn mb-4 ${
                          index === 0 ? 'text-base' : 'text-sm'
                        }`}>{dest.description}</p>
                        <div className="flex items-center text-sm">
                          <span className="font-brooklyn mr-2">Explore</span>
                          <div className="w-6 h-0.5 bg-brand-olive-400 transform transition-all duration-300 group-hover:w-10"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Region Switcher */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 pt-12 border-t border-gray-100 flex items-center justify-between"
            >
              <p className="text-gray-600 font-brooklyn">Explore other regions</p>
              <div className="flex gap-3">
                {Object.entries(regions)
                  .filter(([id]) => id !== selectedRegion)
                  .slice(0, 2)
                  .map(([id, region]) => (
                    <button
                      key={id}
                      onClick={() => setSelectedRegion(id)}
                      className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors"
                    >
                      <span className="font-brooklyn text-gray-800">{region.name}</span>
                      <svg className="w-4 h-4 text-brand-olive-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))
                }
                <button
                  onClick={() => setActiveView('map')}
                  className="flex items-center space-x-2 bg-brand-olive-50 hover:bg-brand-olive-100 px-4 py-2 rounded-md text-brand-olive-600 transition-colors"
                >
                  <span className="font-brooklyn">View All</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}