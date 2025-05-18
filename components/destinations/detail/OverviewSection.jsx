'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Season Progress indicator component
const SeasonProgress = ({ currentSeason }) => {
  const seasons = ['winter', 'spring', 'summer', 'autumn'];
  const currentIndex = seasons.indexOf(currentSeason);
  
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full my-4">
      <motion.div 
        className="absolute top-0 left-0 h-full bg-brand-olive-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(currentIndex + 1) * 25}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <div className="flex justify-between mt-2">
        {seasons.map((season, index) => (
          <div 
            key={season} 
            className={`text-xs uppercase ${index <= currentIndex ? 'text-brand-olive-400 font-medium' : 'text-gray-500'}`}
          >
            {season}
          </div>
        ))}
      </div>
    </div>
  );
};

// Region Hotspot component for the interactive map
const RegionHotspot = ({ x, y, label, description, onClick, isActive }) => {
  return (
    <div 
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? 'z-20' : 'z-10'}`} 
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onClick}
    >
      <div className={`relative flex items-center justify-center ${isActive ? 'scale-125' : 'scale-100 hover:scale-110'}`}>
        <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-brand-olive-400' : 'bg-white border-2 border-brand-olive-400'}`}></div>
        {isActive && (
          <div className="animate-ping absolute w-4 h-4 rounded-full bg-brand-olive-400 opacity-75"></div>
        )}
      </div>
      
      {isActive && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 w-48 z-30">
          <h4 className="font-brooklyn text-brand-olive-400 text-sm">{label}</h4>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      )}
    </div>
  );
};

// Main component
export default function OverviewSection({ destination }) {
  const [activeRegion, setActiveRegion] = useState(null);
  const [currentSeason, setCurrentSeason] = useState('winter');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Regions for the interactive map
  const regions = [
    { id: 1, x: 30, y: 20, label: "Montana", description: "The historic village area known for authentic Alpine charm" },
    { id: 2, x: 70, y: 30, label: "Crans", description: "The cosmopolitan center with luxury shopping and dining" },
    { id: 3, x: 50, y: 60, label: "Ski Domain", description: "140km of pristine slopes offering stunning panoramic views" },
    { id: 4, x: 20, y: 70, label: "Golf Area", description: "Championship courses that host international tournaments" },
    { id: 5, x: 80, y: 70, label: "Alpine Lakes", description: "Serene mountain lakes perfect for hiking and swimming" }
  ];

  // Season Switcher Effect
  useEffect(() => {
    if (isInView) {
      const seasons = ['winter', 'spring', 'summer', 'autumn'];
      let currentIndex = 0;
      
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % seasons.length;
        setCurrentSeason(seasons[currentIndex]);
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [isInView]);

  // Gallery auto-scroll effect
  useEffect(() => {
    if (isInView && destination.imageGallery?.length) {
      const intervalId = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % destination.imageGallery.length);
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [isInView, destination.imageGallery]);
  
  // Get current season image
  const getSeasonImage = () => {
    if (destination.seasonalImages && destination.seasonalImages[currentSeason]) {
      return destination.seasonalImages[currentSeason];
    }
    return destination.image;
  };

  // Get a readable date range for the current season
  const getSeasonDateRange = () => {
    switch (currentSeason) {
      case 'winter': return 'December - March';
      case 'spring': return 'April - May';
      case 'summer': return 'June - August';
      case 'autumn': return 'September - November';
      default: return '';
    }
  };
  
  return (
    <section ref={sectionRef} id="overview-section" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-6">Destination Overview</h2>
          <p className="text-gray-700 max-w-3xl font-brooklyn leading-relaxed">
            {destination.longDescription?.split('\n\n')[0]}
          </p>
        </motion.div>
        
        {/* Interactive Map & Season Viewer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Interactive Map */}
          <motion.div 
            className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm"
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="border-b border-gray-200 py-4 px-6">
              <h3 className="text-xl font-brooklyn text-gray-900">Explore {destination.name}</h3>
              <p className="text-sm text-gray-600 font-brooklyn mt-1">Click on markers to discover different areas</p>
            </div>
            
            <div className="relative p-6 h-[400px]">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {/* Map background */}
                <Image 
                  src={destination.image}
                  alt={`Map of ${destination.name}`}
                  fill
                  className="object-cover brightness-90"
                />
                
                {/* Overlay texture */}
                <div className="absolute inset-0 bg-brand-olive-400/10 mix-blend-multiply"></div>
                
                {/* Map hotspots */}
                {regions.map(region => (
                  <RegionHotspot 
                    key={region.id}
                    x={region.x}
                    y={region.y}
                    label={region.label}
                    description={region.description}
                    isActive={activeRegion === region.id}
                    onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Seasonal Highlights */}
          <motion.div 
            className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm"
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="border-b border-gray-200 py-4 px-6">
              <h3 className="text-xl font-brooklyn text-gray-900">Seasonal Experience</h3>
              <p className="text-sm text-gray-600 font-brooklyn mt-1">Watch how {destination.name} transforms throughout the year</p>
            </div>
            
            <div className="p-6">
              <div className="relative h-[280px] rounded-xl overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSeason}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={getSeasonImage()}
                      alt={`${destination.name} in ${currentSeason}`}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-white">
                        <h4 className="font-brooklyn text-xl capitalize">{currentSeason}</h4>
                        <p className="text-sm opacity-90 font-brooklyn">{getSeasonDateRange()}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <SeasonProgress currentSeason={currentSeason} />
              
              <div className="mt-4">
                <h4 className="font-brooklyn text-lg mb-2 capitalize">{currentSeason} Highlights</h4>
                <ul className="text-sm text-gray-700 space-y-1 font-brooklyn">
                  {currentSeason === 'winter' && (
                    <>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> World-class skiing across 140km of slopes</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Festive markets and alpine celebrations</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Thermal spa experiences with snowy views</li>
                    </>
                  )}
                  {currentSeason === 'spring' && (
                    <>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Alpine wildflowers in full bloom</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Hiking trails opening with fresh mountain air</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Spring cuisine featuring local ingredients</li>
                    </>
                  )}
                  {currentSeason === 'summer' && (
                    <>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Championship golf tournaments</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Mountain biking and paragliding adventures</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Alfresco dining with panoramic views</li>
                    </>
                  )}
                  {currentSeason === 'autumn' && (
                    <>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Spectacular golden larch forests</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Wine harvest and gastronomic festivals</li>
                      <li className="flex items-center"><span className="text-brand-olive-400 mr-2">●</span> Peaceful hiking with fewer crowds</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Mood Gallery */}
        <motion.div 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-brooklyn mb-6">Capturing the Essence</h3>
          
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar py-4 -mx-4 px-4 space-x-4">
              {destination.imageGallery?.map((image, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 w-80 h-48 md:h-64 rounded-xl overflow-hidden transform transition-all duration-500 ${
                    index === activeImageIndex 
                      ? 'scale-105 ring-2 ring-brand-olive-400 shadow-lg' 
                      : 'scale-100 brightness-90'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`${destination.name} scene ${index + 1}`}
                      fill
                      className="object-cover transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {destination.imageGallery?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeImageIndex 
                      ? 'bg-brand-olive-400 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Additional Info */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="prose prose-lg max-w-none font-brooklyn">
            {destination.longDescription?.split('\n\n').slice(1).map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">{paragraph.trim()}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}