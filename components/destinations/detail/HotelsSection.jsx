'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Price Range Slider Component
const PriceRangeSlider = ({ value, onChange }) => {
  const priceLabels = ['€', '€€', '€€€', '€€€€', '€€€€€'];
  
  return (
    <div className="mt-4 px-4">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-gray-500 font-brooklyn">Budget</span>
        <span className="text-xs text-gray-500 font-brooklyn">Luxury</span>
      </div>
      
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-olive-400"
      />
      
      <div className="flex justify-between mt-1">
        {priceLabels.map((label, index) => (
          <div 
            key={index} 
            className={`text-xs ${
              index < value ? 'text-brand-olive-400 font-medium' : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Feature Toggle Button
const FeatureToggle = ({ feature, isActive, onClick }) => {
  return (
    <button
      className={`py-1.5 px-3 text-xs font-brooklyn rounded-full transition-all ${
        isActive 
          ? 'bg-brand-olive-400 text-white shadow-sm' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      {feature}
    </button>
  );
};

// Hotel Card with Hover Effect
const HotelCard = ({ hotel }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm group cursor-pointer"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={hotel.url || '#'}>
        <div className="relative h-52 overflow-hidden">
          <Image 
            src={hotel.image}
            alt={hotel.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white">
              <span className="inline-block text-xs font-brooklyn px-2 py-1 bg-brand-olive-400/80 rounded-full mb-2">
                {hotel.price}
              </span>
              <h3 className="font-brooklyn text-lg">{hotel.name}</h3>
              <p className="text-sm text-white/90">{hotel.location}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 text-sm font-brooklyn leading-relaxed mb-3 line-clamp-2">
            {hotel.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-auto">
            {hotel.features?.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                {feature}
              </span>
            ))}
            {hotel.features?.length > 3 && (
              <span className="text-xs text-gray-500 px-1 py-0.5 font-brooklyn">
                +{hotel.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Inside Look Feature Component
const InsideLook = ({ hotels }) => {
  const [selectedHotel, setSelectedHotel] = useState(0);
  const [isBeforeView, setIsBeforeView] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  
  const hotel = hotels[selectedHotel];
  
  // Get "before" and "after" images (in this case, we'll just use different images)
  const getBeforeImage = () => hotel?.image || '/images/hotels/hotel-1.jpg';
  const getAfterImage = () => {
    const hotelImages = hotels.map(h => h.image);
    const index = (selectedHotel + 1) % hotels.length;
    return hotelImages[index] || '/images/hotels/hotel-2.jpg';
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-brooklyn text-xl">Inside Look</h3>
        <p className="text-sm text-gray-600 font-brooklyn">Compare day and night views</p>
      </div>
      
      <div className="p-4">
        <div className="flex overflow-x-auto hide-scrollbar -mx-2 px-2 py-2 space-x-2 mb-4">
          {hotels.map((hotel, index) => (
            <button
              key={index}
              className={`flex-shrink-0 rounded-lg transition-all overflow-hidden ${
                selectedHotel === index ? 'ring-2 ring-brand-olive-400' : ''
              }`}
              onClick={() => setSelectedHotel(index)}
            >
              <div className="relative w-16 h-16">
                <Image 
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
        
        <div className="relative h-64 rounded-lg overflow-hidden mb-3">
          {/* Before image */}
          <div className="absolute inset-0">
            <Image 
              src={getBeforeImage()}
              alt="Day view"
              fill
              className="object-cover"
            />
          </div>
          
          {/* After image with clip-path */}
          <div 
            className="absolute inset-0"
            style={{ 
              clipPath: `inset(0 ${100 - sliderValue}% 0 0)`,
              transition: 'clip-path 0.1s ease-out'
            }}
          >
            <Image 
              src={getAfterImage()}
              alt="Night view"
              fill
              className="object-cover"
            />
            
            {/* Vertical slider line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
              style={{ left: `${sliderValue}%` }}
            >
              <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-brand-olive-400"></div>
              </div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-brooklyn">
            Day View
          </div>
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-brooklyn">
            Night View
          </div>
        </div>
        
        {/* Slider Control */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={e => setSliderValue(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-olive-400"
        />
        
        <h4 className="font-brooklyn text-lg mt-4">{hotel?.name}</h4>
        <p className="text-sm text-gray-700 font-brooklyn">{hotel?.description}</p>
      </div>
    </div>
  );
};

// Main Component
export default function HotelsSection({ destination }) {
  const [priceFilter, setPriceFilter] = useState(3);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState(destination.hotels || []);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // All possible features from hotels
  const allFeatures = [...new Set(
    destination.hotels
      ?.flatMap(hotel => hotel.features || []) || []
  )];
  
  // Apply filters
  useEffect(() => {
    if (!destination.hotels) return;
    
    const filtered = destination.hotels.filter(hotel => {
      // Price filter (assuming price is in € format where more € means more expensive)
      const hotelPriceLevel = (hotel.price?.match(/€/g) || []).length;
      const priceMatch = hotelPriceLevel <= priceFilter;
      
      // Feature filter
      const featureMatch = selectedFeatures.length === 0 || 
        selectedFeatures.every(feature => hotel.features?.includes(feature));
      
      return priceMatch && featureMatch;
    });
    
    setFilteredHotels(filtered);
  }, [destination.hotels, priceFilter, selectedFeatures]);
  
  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  return (
    <section ref={sectionRef} id="hotels-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-6">
            Where to Stay in {destination.name}
          </h2>
          <p className="text-gray-700 max-w-3xl font-brooklyn leading-relaxed">
            From boutique hideaways nestled in the mountains to cosmopolitan luxury hotels, 
            {destination.name} offers accommodations as diverse as the landscape itself. 
            Discover your perfect Alpine retreat.
          </p>
        </motion.div>
        
        {/* Filters Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-brooklyn text-lg">Filter Hotels</h3>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-brooklyn text-sm mb-3">Price Range</h4>
              <PriceRangeSlider value={priceFilter} onChange={setPriceFilter} />
            </div>
            
            <div>
              <h4 className="font-brooklyn text-sm mb-3">Features</h4>
              <div className="flex flex-wrap gap-2">
                {allFeatures.map((feature, index) => (
                  <FeatureToggle
                    key={index}
                    feature={feature}
                    isActive={selectedFeatures.includes(feature)}
                    onClick={() => toggleFeature(feature)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-brooklyn text-gray-600">
              Showing {filteredHotels.length} of {destination.hotels?.length || 0} hotels
            </span>
            
            <button 
              className="text-sm text-brand-olive-400 font-brooklyn hover:underline"
              onClick={() => {
                setPriceFilter(5);
                setSelectedFeatures([]);
              }}
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
        
        {/* Hotel Grid & Inside Look */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <HotelCard hotel={hotel} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* No Results Message */}
            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <svg 
                    className="w-16 h-16 mx-auto text-gray-300 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <h3 className="text-xl font-brooklyn text-gray-700 mb-2">No hotels match your filters</h3>
                  <p className="text-gray-500 font-brooklyn mb-4">Try adjusting your filters to find the perfect stay</p>
                  <button 
                    className="bg-brand-olive-400 text-white px-4 py-2 rounded-full font-brooklyn text-sm hover:bg-brand-olive-500 transition-colors"
                    onClick={() => {
                      setPriceFilter(5);
                      setSelectedFeatures([]);
                    }}
                  >
                    Reset Filters
                  </button>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Inside Look Feature */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <InsideLook hotels={destination.hotels || []} />
              
              {/* Quick Booking CTA */}
              <div className="bg-brand-olive-400 rounded-xl p-6 mt-6 text-white">
                <h3 className="font-brooklyn text-xl mb-3">Need Booking Assistance?</h3>
                <p className="font-brooklyn text-white/90 text-sm mb-4">
                  Our concierge team can help you find the perfect accommodation 
                  and create a bespoke travel itinerary.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block w-full text-center py-3 bg-white text-brand-olive-500 rounded-full font-brooklyn text-sm hover:bg-gray-100 transition-colors"
                >
                  Contact Our Concierge
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}