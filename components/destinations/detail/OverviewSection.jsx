'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Season Progress indicator component
const SeasonProgress = ({ currentSeason, overviewData }) => {
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
            {overviewData?.[`overview_season_${season}`] || season}
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
export default function OverviewSection({ destination = "Crans-Montana", destinationData = {}, overviewData = {} }) {
  const [activeRegion, setActiveRegion] = useState(null);
  const [currentSeason, setCurrentSeason] = useState('winter');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Use images field from destination data or fallback to sample images
  const imageGallery = destinationData?.images && Array.isArray(destinationData.images) && destinationData.images.length > 0
    ? destinationData.images
    : destinationData?.gallery && Array.isArray(destinationData.gallery) && destinationData.gallery.length > 0
    ? destinationData.gallery
    : [
        "/images/destinations/crans-montana/main.jpg",
        "/images/destinations/crans-montana/village.jpg",
        "/images/destinations/crans-montana/lake.jpg",
        "/images/destinations/crans-montana/golf.jpg",
        "/images/destinations/crans-montana/ski.jpg",
      ];
  
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
    if (isInView) {
      const intervalId = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % imageGallery.length);
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [isInView, imageGallery.length]);
  
  // Get current season image
  const getSeasonImage = () => {
    const seasonImages = {
      winter: "/images/destinations/crans-montana/winter.jpg",
      spring: "/images/destinations/crans-montana/spring.jpg",
      summer: "/images/destinations/crans-montana/summer.jpg",
      autumn: "/images/destinations/crans-montana/autumn.jpg"
    };
    
    return seasonImages[currentSeason];
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
    <section ref={sectionRef} id="overview" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-6">{overviewData?.overview_destination || 'Destination'} <span className="font-bold">{overviewData?.overview_overview || 'Overview'}</span></h2>
          <p className="text-gray-700 max-w-3xl font-brooklyn leading-relaxed">
            {destinationData?.description || `${destination} combines Alpine elegance with breathtaking natural beauty. Perched at 1,500m in the heart of the Swiss Alps, this dual-village destination offers panoramic views of the Rhone Valley and iconic peaks including the Matterhorn. A playground for both winter and summer adventures, it blends world-class skiing with championship golf courses, hiking trails, and exclusive shopping.`}
          </p>
        </motion.div>
        
        {/* Interactive Map & Season Viewer Section */}
        <div className={`grid grid-cols-1 ${(destinationData.show_explore_box && destinationData.show_seasonal_box) ? 'lg:grid-cols-2' : ''} gap-8 md:gap-12 mb-16`}>
          {/* Interactive Map - Only show if enabled in Directus */}
          {destinationData.show_explore_box && (
            <motion.div 
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm"
              initial={{ x: -50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="border-b border-gray-200 py-4 px-6">
                <h3 className="text-xl font-brooklyn text-gray-900">
                  {destinationData.explore_box_title || `Explore ${destination}`}
                </h3>
                <div 
                  className="text-sm text-gray-600 font-brooklyn mt-1"
                  dangerouslySetInnerHTML={{ __html: destinationData.explore_box_content || overviewData?.overview_click_markers || 'Click on markers to discover different areas' }}
                />
              </div>
            
            <div className="relative p-6 h-[400px]">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                {/* Map background */}
                <Image 
                  src="/images/destinations/crans-montana/map.jpg"
                  alt={`Map of ${destination}`}
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
          )}
          
          {/* Seasonal Highlights - Only show if enabled in Directus */}
          {destinationData.show_seasonal_box && (
            <motion.div 
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm"
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="border-b border-gray-200 py-4 px-6">
                <h3 className="text-xl font-brooklyn text-gray-900">
                  {destinationData.seasonal_box_title || 'Seasonal Experience'}
                </h3>
                <div 
                  className="text-sm text-gray-600 font-brooklyn mt-1"
                  dangerouslySetInnerHTML={{ __html: destinationData.seasonal_box_content || (overviewData?.overview_watch_transforms ? overviewData.overview_watch_transforms.replace('{destination}', destination) : `Watch how ${destination} transforms throughout the year`) }}
                />
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
                      alt={`${destination} in ${currentSeason}`}
                      fill
                      className="object-cover"
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="text-white">
                        <h4 className="font-brooklyn text-xl capitalize">{overviewData?.[`overview_season_${currentSeason}`] || currentSeason}</h4>
                        <p className="text-sm opacity-90 font-brooklyn">{getSeasonDateRange()}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <SeasonProgress currentSeason={currentSeason} overviewData={overviewData} />
              
              <div className="mt-4">
                <h4 className="font-brooklyn text-lg mb-2 capitalize">{overviewData?.[`overview_season_${currentSeason}`] || currentSeason} {overviewData?.overview_highlights || 'Highlights'}</h4>
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
          )}
        </div>

        
        {/* Capturing the Essence - Image Gallery */}
        <motion.div 
          className="mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-brooklyn mb-6">{overviewData?.overview_capturing || 'Capturing'} {overviewData?.overview_essence || 'the Essence'}</h3>
          
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar py-4 -mx-4 px-4 space-x-4">
              {imageGallery.map((image, index) => (
                <div 
                  key={index} 
                  className={`flex-shrink-0 w-80 h-48 md:h-64 rounded-xl overflow-hidden transform transition-all duration-500 ${
                    index === activeImageIndex 
                      ? 'scale-105 ring-2 ring-brand-olive-400 shadow-lg' 
                      : 'scale-100 brightness-90'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div className="relative w-full h-full group">
                    <Image
                      src={image}
                      alt={`${destination} scene ${index + 1}`}
                      fill
                      className="object-cover transition-all duration-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullscreenImage(image);
                      }}
                    />
                    {/* Zoom icon on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <svg 
                        className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {imageGallery.map((_, index) => (
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
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="prose prose-lg max-w-none font-brooklyn">
            {destinationData?.longDescription || destinationData?.overview_content ? (
              <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: destinationData?.longDescription || destinationData?.overview_content }} />
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed">
                  {destination} offers an unparalleled blend of adventure and relaxation in the Swiss Alps. This dual-village resort provides four-season activities, from world-class skiing and snowboarding in winter to championship golf in summer. The destination balances traditional Alpine charm with cosmopolitan luxuries, featuring Michelin-starred restaurants, exclusive boutiques, and rejuvenating wellness facilities.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The region's microclimate ensures approximately 300 days of sunshine annually, while its elevation of 1,500 meters provides spectacular panoramic views of iconic peaks, including the Matterhorn. Cultural events and festivals enliven the calendar year-round, showcasing local traditions alongside international music and art. Whether seeking thrilling outdoor adventures or peaceful alpine serenity, {destination} delivers an authentic Swiss mountain experience with uncompromising quality.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = imageGallery.indexOf(fullscreenImage);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : imageGallery.length - 1;
                setFullscreenImage(imageGallery[prevIndex]);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = imageGallery.indexOf(fullscreenImage);
                const nextIndex = currentIndex < imageGallery.length - 1 ? currentIndex + 1 : 0;
                setFullscreenImage(imageGallery[nextIndex]);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image */}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullscreenImage}
                alt="Fullscreen view"
                width={1920}
                height={1080}
                className="object-contain max-w-full max-h-[90vh] w-auto h-auto"
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {imageGallery.indexOf(fullscreenImage) + 1} / {imageGallery.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}