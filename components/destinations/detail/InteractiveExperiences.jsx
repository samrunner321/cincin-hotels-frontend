'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Interactive Experiences component to replace "Compare day/night views"
export default function InteractiveExperiences({ destination }) {
  const [activeExperience, setActiveExperience] = useState('seasonalShift');
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(50);
  const [animation, setAnimation] = useState({ current: 0, target: 0 });
  const sectionRef = useRef(null);
  const compareRef = useRef(null);
  const timelapseRef = useRef(null);
  const panoramaRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Experiences offered
  const experiences = [
    { 
      id: 'seasonalShift', 
      name: 'Seasonal Shift', 
      description: 'Experience how the landscape transforms throughout the seasons with our interactive slider.' 
    },
    { 
      id: 'dayNightTransition', 
      name: 'Day & Night', 
      description: 'See how this destination transforms from daylight to evening with dramatic lighting changes.' 
    },
    { 
      id: 'virtualPanorama', 
      name: 'Virtual Panorama', 
      description: 'Explore immersive 360° views of key locations with our interactive panorama viewer.' 
    }
  ];

  // Handle drag operations for seasonal slider
  const handleMouseDown = (e) => {
    if (activeExperience !== 'seasonalShift' && activeExperience !== 'dayNightTransition') return;
    
    setIsDragging(true);
    updateDragPosition(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateDragPosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateDragPosition = (e) => {
    if (!compareRef.current) return;
    
    const rect = compareRef.current.getBoundingClientRect();
    let position;
    
    if (e.type.includes('touch')) {
      position = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    } else {
      position = ((e.clientX - rect.left) / rect.width) * 100;
    }
    
    // Constrain position between 0 and 100
    position = Math.max(0, Math.min(100, position));
    setDragPosition(position);
  };

  // For panorama view
  useEffect(() => {
    if (activeExperience !== 'virtualPanorama' || !panoramaRef.current) return;
    
    const animatePanorama = () => {
      if (!panoramaRef.current) return;
      
      // Smoothly animate current value towards target
      animation.current += (animation.target - animation.current) * 0.05;
      
      // Apply the transformation
      panoramaRef.current.style.transform = `translateX(${-animation.current * 50}%)`;
      
      requestAnimationFrame(animatePanorama);
    };
    
    const handleMouseMove = (e) => {
      if (!panoramaRef.current) return;
      
      const rect = panoramaRef.current.parentElement.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      
      // Set target position based on mouse position
      setAnimation(prev => ({ ...prev, target: x }));
    };
    
    panoramaRef.current.parentElement.addEventListener('mousemove', handleMouseMove);
    const animationFrame = requestAnimationFrame(animatePanorama);
    
    return () => {
      if (panoramaRef.current?.parentElement) {
        panoramaRef.current.parentElement.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrame);
    };
  }, [activeExperience, animation]);

  // For timelapse effect
  useEffect(() => {
    if (activeExperience !== 'dayNightTransition' || !timelapseRef.current) return;
    
    let frame = 0;
    const frameCount = 10;
    let lastTimestamp = 0;
    
    const animateTimelapse = (timestamp) => {
      if (!timelapseRef.current) return;
      
      // Only update every 200ms
      if (timestamp - lastTimestamp > 200) {
        lastTimestamp = timestamp;
        frame = (frame + 1) % frameCount;
        
        // Calculate position based on frame
        const position = (frame / (frameCount - 1)) * 100;
        setDragPosition(position);
      }
      
      timelapseId = requestAnimationFrame(animateTimelapse);
    };
    
    let timelapseId = requestAnimationFrame(animateTimelapse);
    
    return () => {
      cancelAnimationFrame(timelapseId);
    };
  }, [activeExperience]);

  // Determine which images to use based on active experience
  const getBeforeImage = () => {
    if (activeExperience === 'seasonalShift') {
      return '/images/hotels/hotel-2.jpg'; // Winter image
    } else if (activeExperience === 'dayNightTransition') {
      return '/images/hotels/hotel-4.jpg'; // Day image
    } else {
      return '/images/hotels/hotel-6.jpg'; // Default
    }
  };

  const getAfterImage = () => {
    if (activeExperience === 'seasonalShift') {
      return '/images/hotels/hotel-3.jpg'; // Summer image
    } else if (activeExperience === 'dayNightTransition') {
      return '/images/hotels/hotel-5.jpg'; // Night image
    } else {
      return '/images/hotels/hotel-7.jpg'; // Default
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-4">Interactive Experiences</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Discover {destination?.name || 'this destination'} in unique ways through our interactive visual tools. Explore 
            seasonal changes, day-to-night transitions, and immersive panoramic views.
          </p>
        </motion.div>
        
        {/* Experience selector tabs */}
        <div className="flex flex-wrap justify-center mb-10 gap-3">
          {experiences.map(experience => (
            <button 
              key={experience.id}
              onClick={() => setActiveExperience(experience.id)}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeExperience === experience.id 
                  ? 'bg-brand-olive-400 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {experience.name}
            </button>
          ))}
        </div>
        
        {/* Dynamic content based on selected experience */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeExperience === 'seasonalShift' && (
              <motion.div
                key="seasonal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* Interactive image comparison slider */}
                <div className="lg:w-3/5">
                  <div 
                    ref={compareRef}
                    className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                  >
                    {/* Winter image (full width) */}
                    <div className="absolute inset-0">
                      <Image 
                        src={getBeforeImage()}
                        alt="Winter view"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Summer image (clipped based on slider) */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        clipPath: `inset(0 ${100 - dragPosition}% 0 0)` 
                      }}
                    >
                      <Image 
                        src={getAfterImage()}
                        alt="Summer view"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Vertical divider with handle */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                        style={{ left: `${dragPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-brand-olive-400"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-brooklyn text-gray-800">
                      Winter
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-brooklyn text-gray-800">
                      Summer
                    </div>
                    
                    {/* Instruction overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.div 
                        className="bg-black/40 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 2, duration: 1 }}
                      >
                        Drag slider to compare seasons
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="lg:w-2/5">
                  <h3 className="text-2xl font-brooklyn text-gray-900 mb-4">Seasonal Transformation</h3>
                  <p className="text-gray-600 mb-6">
                    Experience how {destination?.name || 'this destination'} transforms dramatically from winter snowscapes to vibrant summer landscapes. Drag the slider to reveal the contrast between seasons and discover the year-round beauty this destination offers.
                  </p>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-brooklyn text-gray-900 mb-3">Seasonal Highlights</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Winter (December - March)</h5>
                          <p className="text-gray-600 text-sm">Pristine snowscapes, skiing, and cozy Alpine traditions with temperatures ranging from -5°C to 5°C.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Summer (June - August)</h5>
                          <p className="text-gray-600 text-sm">Lush Alpine meadows, hiking trails, mountain lakes, and outdoor dining with pleasant temperatures of 15°C to 25°C.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeExperience === 'dayNightTransition' && (
              <motion.div
                key="daynight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* Day/Night comparison */}
                <div className="lg:w-3/5">
                  <div 
                    ref={timelapseRef}
                    className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer shadow-lg"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                  >
                    {/* Day image (full width) */}
                    <div className="absolute inset-0">
                      <Image 
                        src={getBeforeImage()}
                        alt="Day view"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Night image (clipped based on slider) */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        clipPath: `inset(0 ${100 - dragPosition}% 0 0)` 
                      }}
                    >
                      <Image 
                        src={getAfterImage()}
                        alt="Night view"
                        fill
                        className="object-cover"
                      />
                      
                      {/* Vertical divider with handle */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                        style={{ left: `${dragPosition}%` }}
                      >
                        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-brand-olive-400"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-brooklyn text-gray-800">
                      Day
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-brooklyn text-white">
                      Night
                    </div>
                    
                    {/* Time indicator (sun/moon) */}
                    <div 
                      className="absolute top-4 transition-all duration-300"
                      style={{ left: `${dragPosition}%`, transform: 'translateX(-50%)' }}
                    >
                      {dragPosition < 50 ? (
                        <div className="bg-yellow-400/90 backdrop-blur-sm text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        <div className="bg-indigo-900/90 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="lg:w-2/5">
                  <h3 className="text-2xl font-brooklyn text-gray-900 mb-4">Day to Night Experience</h3>
                  <p className="text-gray-600 mb-6">
                    Watch how {destination?.name || 'this destination'} transforms as the sun sets and night falls. Drag the slider to transition between daytime vibrancy and evening ambiance, revealing two distinct faces of this remarkable location.
                  </p>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-brooklyn text-gray-900 mb-3">Atmosphere Comparison</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Daytime Experience</h5>
                          <p className="text-gray-600 text-sm">Vibrant activities, bustling markets, and clear Alpine views with a lively atmosphere throughout the village.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Evening Ambiance</h5>
                          <p className="text-gray-600 text-sm">Enchanting illuminated streets, cozy restaurants with warm lighting, and spectacular stargazing opportunities.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeExperience === 'virtualPanorama' && (
              <motion.div
                key="panorama"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* 360° Panorama simulation */}
                <div className="lg:w-3/5">
                  <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-900">
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Extra-wide panoramic image that will move based on mouse position */}
                      <div 
                        ref={panoramaRef}
                        className="h-full w-[200%] transition-transform duration-500 relative"
                        style={{ transform: 'translateX(0%)' }}
                      >
                        <Image 
                          src="/images/hotels/hotel-1.jpg"
                          alt="Panoramic view"
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Instruction overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: 2, duration: 1 }}
                        >
                          Move mouse to explore panorama
                        </motion.div>
                      </div>
                      
                      {/* Compass indicator */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-3">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M3 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M19 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M12 12L8 8" stroke="red" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="lg:w-2/5">
                  <h3 className="text-2xl font-brooklyn text-gray-900 mb-4">Immersive Panorama</h3>
                  <p className="text-gray-600 mb-6">
                    Experience {destination?.name || 'this destination'} in 360° through our interactive panorama viewer. Move your mouse to explore the landscape in all directions and immerse yourself in the stunning surroundings.
                  </p>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h4 className="font-brooklyn text-gray-900 mb-3">Key Viewpoints</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-50 rounded-full flex items-center justify-center text-brand-olive-400 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Village Center Panorama</h5>
                          <p className="text-gray-600 text-sm">Experience the heart of the village with its traditional architecture, shops, and mountain backdrop.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-50 rounded-full flex items-center justify-center text-brand-olive-400 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Mountain Summit View</h5>
                          <p className="text-gray-600 text-sm">Take in breathtaking 360° views from one of the highest accessible peaks in the region.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-50 rounded-full flex items-center justify-center text-brand-olive-400 mr-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-brooklyn text-gray-900 mb-1">Lake Perspective</h5>
                          <p className="text-gray-600 text-sm">Enjoy the serene beauty of the Alpine lake with surrounding mountains reflected in its crystal-clear waters.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}