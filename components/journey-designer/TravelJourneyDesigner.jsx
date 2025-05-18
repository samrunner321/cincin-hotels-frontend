'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function TravelJourneyDesigner() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [preferences, setPreferences] = useState({
    travelerType: null,
    destination: null,
    experiences: [],
    accommodationType: null,
    seasonality: null
  });
  const [selectedJourney, setSelectedJourney] = useState(null);
  const containerRef = useRef(null);
  
  // Options for each step
  const steps = [
    {
      id: 'travelerType',
      title: 'What kind of traveler are you?',
      options: [
        { id: 'solo', label: 'Solo Traveler', icon: '🧳' },
        { id: 'couple', label: 'Couple', icon: '💑' },
        { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
        { id: 'friends', label: 'Friends Group', icon: '👯‍♀️' }
      ]
    },
    {
      id: 'destination',
      title: 'Select your dream destination',
      options: [
        { id: 'mountains', label: 'Mountains', icon: '🏔️' },
        { id: 'beach', label: 'Beach', icon: '🏝️' },
        { id: 'city', label: 'City', icon: '🏙️' },
        { id: 'countryside', label: 'Countryside', icon: '🌄' }
      ]
    },
    {
      id: 'experiences',
      title: 'Choose your preferred experiences',
      multiSelect: true,
      options: [
        { id: 'culinary', label: 'Culinary', icon: '🍽️' },
        { id: 'wellness', label: 'Wellness & Spa', icon: '💆‍♀️' },
        { id: 'adventure', label: 'Adventure', icon: '🧗‍♂️' },
        { id: 'cultural', label: 'Cultural', icon: '🏛️' },
        { id: 'nightlife', label: 'Nightlife', icon: '🍸' },
        { id: 'nature', label: 'Nature', icon: '🌿' }
      ]
    },
    {
      id: 'accommodationType',
      title: 'What type of accommodation do you prefer?',
      options: [
        { id: 'luxury', label: 'Luxury', icon: '✨' },
        { id: 'boutique', label: 'Boutique', icon: '🏡' },
        { id: 'design', label: 'Design-forward', icon: '🎨' },
        { id: 'historic', label: 'Historic', icon: '🏰' }
      ]
    },
    {
      id: 'seasonality',
      title: 'When would you like to travel?',
      options: [
        { id: 'winter', label: 'Winter', icon: '❄️' },
        { id: 'spring', label: 'Spring', icon: '🌷' },
        { id: 'summer', label: 'Summer', icon: '☀️' },
        { id: 'autumn', label: 'Autumn', icon: '🍂' }
      ]
    }
  ];

  // Predefined journeys based on user preferences
  const journeys = [
    {
      id: 1,
      title: "Alpine Wellness Retreat",
      description: "Rejuvenate in the Swiss Alps with spa treatments, thermal baths, and stunning mountain vistas.",
      matches: {
        travelerType: ['couple', 'solo'],
        destination: 'mountains',
        experiences: ['wellness', 'nature'],
        accommodationType: ['luxury', 'design'],
        seasonality: ['winter', 'summer']
      },
      hotels: [
        { id: 1, name: "Chetzeron", location: "Crans-Montana", image: "/images/hotels/hotel-1.jpg" },
        { id: 2, name: "LeCrans Hotel & Spa", location: "Crans-Montana", image: "/images/hotels/hotel-2.jpg" }
      ],
      imageBg: "/images/hotels/hotel-2.jpg"
    },
    {
      id: 2,
      title: "Mediterranean Family Adventure",
      description: "Create unforgettable memories with your family on the stunning Mediterranean coastline.",
      matches: {
        travelerType: ['family'],
        destination: 'beach',
        experiences: ['adventure', 'nature', 'culinary'],
        accommodationType: ['luxury', 'boutique'],
        seasonality: ['summer', 'spring']
      },
      hotels: [
        { id: 3, name: "Hotel Guarda Golf", location: "Crans-Montana", image: "/images/hotels/hotel-3.jpg" },
        { id: 4, name: "Crans Ambassador", location: "Crans-Montana", image: "/images/hotels/hotel-4.jpg" }
      ],
      imageBg: "/images/hotels/hotel-3.jpg"
    },
    {
      id: 3,
      title: "Urban Cultural Exploration",
      description: "Immerse yourself in the vibrant culture, history, and culinary scene of Europe's most captivating cities.",
      matches: {
        travelerType: ['couple', 'friends', 'solo'],
        destination: 'city',
        experiences: ['cultural', 'culinary', 'nightlife'],
        accommodationType: ['boutique', 'design', 'historic'],
        seasonality: ['spring', 'autumn']
      },
      hotels: [
        { id: 5, name: "Art de Vivre Hotel", location: "Paris", image: "/images/hotels/hotel-5.jpg" },
        { id: 6, name: "Michelberger Hotel", location: "Berlin", image: "/images/hotels/hotel-6.jpg" }
      ],
      imageBg: "/images/hotels/hotel-5.jpg"
    },
    {
      id: 4,
      title: "Countryside Gastronomy Tour",
      description: "Savor the authentic flavors and culinary traditions of Europe's most picturesque countryside regions.",
      matches: {
        travelerType: ['couple', 'friends'],
        destination: 'countryside',
        experiences: ['culinary', 'nature', 'cultural'],
        accommodationType: ['boutique', 'historic'],
        seasonality: ['summer', 'autumn']
      },
      hotels: [
        { id: 7, name: "Villa Honegg", location: "Swiss Countryside", image: "/images/hotels/hotel-7.jpg" },
        { id: 8, name: "Forestis Dolomites", location: "South Tyrol", image: "/images/hotels/hotel-1.jpg" }
      ],
      imageBg: "/images/hotels/hotel-7.jpg"
    },
    {
      id: 5,
      title: "Winter Alpine Adventure",
      description: "Experience thrilling winter sports and cozy evening retreats in the majestic Alps.",
      matches: {
        travelerType: ['friends', 'couple'],
        destination: 'mountains',
        experiences: ['adventure', 'wellness'],
        accommodationType: ['luxury', 'design'],
        seasonality: ['winter']
      },
      hotels: [
        { id: 9, name: "Chetzeron", location: "Crans-Montana", image: "/images/hotels/hotel-1.jpg" },
        { id: 10, name: "Vigilius Mountain Resort", location: "South Tyrol", image: "/images/hotels/hotel-2.jpg" }
      ],
      imageBg: "/images/hotels/hotel-6.jpg"
    }
  ];

  // When the user completes all steps, find matching journeys
  useEffect(() => {
    if (activeStep >= steps.length) {
      findMatchingJourney();
    }
  }, [activeStep]);

  // Find journeys that match user preferences
  const findMatchingJourney = () => {
    let bestMatch = null;
    let highestScore = 0;

    journeys.forEach(journey => {
      let score = 0;

      // Check traveler type
      if (journey.matches.travelerType.includes(preferences.travelerType)) {
        score += 2;
      }

      // Check destination
      if (journey.matches.destination === preferences.destination) {
        score += 2;
      }

      // Check experiences (count matches)
      const experienceMatches = preferences.experiences.filter(exp => 
        journey.matches.experiences.includes(exp)
      ).length;
      score += experienceMatches;

      // Check accommodation type
      if (journey.matches.accommodationType.includes(preferences.accommodationType)) {
        score += 1;
      }

      // Check seasonality
      if (journey.matches.seasonality.includes(preferences.seasonality)) {
        score += 1;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = journey;
      }
    });

    setSelectedJourney(bestMatch);
  };

  // Handle option selection
  const handleSelect = (option) => {
    const currentStep = steps[activeStep];
    
    if (currentStep.multiSelect) {
      // Toggle selection for multi-select
      setPreferences(prev => {
        const experiences = [...prev.experiences];
        const index = experiences.indexOf(option.id);
        
        if (index > -1) {
          experiences.splice(index, 1);
        } else {
          experiences.push(option.id);
        }
        
        return { ...prev, experiences };
      });
    } else {
      // Single selection for other steps
      setPreferences(prev => ({ 
        ...prev, 
        [currentStep.id]: option.id 
      }));
      
      // Move to next step if not multi-select
      setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 400);
    }
  };

  // Handle next/back for multi-select and navigation
  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setPreferences({
      travelerType: null,
      destination: null,
      experiences: [],
      accommodationType: null,
      seasonality: null
    });
    setActiveStep(0);
    setSelectedJourney(null);
  };

  // Check if option is selected
  const isSelected = (option) => {
    const currentStep = steps[activeStep];
    if (currentStep?.multiSelect) {
      return preferences.experiences.includes(option.id);
    }
    return preferences[currentStep?.id] === option.id;
  };

  // Progress percentage for progress bar
  const progress = (activeStep / steps.length) * 100;

  return (
    <>
      {/* Fixed button to open designer */}
      <div className="fixed left-6 bottom-6 z-40">
        <motion.button
          className="bg-brand-olive-400 text-white px-4 py-3 rounded-full shadow-lg hover:bg-brand-olive-500 transition-colors flex items-center space-x-2"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-brooklyn">Design Your Journey</span>
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              ref={containerRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-24 bg-brand-olive-400 flex items-end">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern)" />
                  </svg>
                </div>
                
                <div className="p-6 text-white w-full">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-brooklyn">Travel Journey Designer</h2>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-100">
                <div 
                  className="h-full bg-brand-olive-400 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeStep < steps.length ? (
                  <>
                    <div className="mb-8">
                      <h3 className="text-xl font-brooklyn text-gray-900 mb-2">
                        {steps[activeStep].title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Step {activeStep + 1} of {steps.length}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {steps[activeStep].options.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleSelect(option)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                            isSelected(option)
                              ? 'border-brand-olive-400 bg-brand-olive-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-2xl mb-1">{option.icon}</span>
                          <span className="text-sm font-brooklyn text-center">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      {activeStep > 0 ? (
                        <button
                          onClick={handleBack}
                          className="px-4 py-2 text-gray-600 hover:text-gray-900 font-brooklyn flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {steps[activeStep].multiSelect && (
                        <button
                          onClick={handleNext}
                          disabled={preferences.experiences.length === 0}
                          className="px-6 py-2 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          Next
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // Results screen
                  <div className="py-4">
                    {selectedJourney ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-brooklyn text-gray-900 mb-2">
                            Your Perfect Travel Journey
                          </h3>
                          <p className="text-gray-500">
                            Based on your preferences, we've designed the ideal journey for you.
                          </p>
                        </div>

                        <div className="relative rounded-xl overflow-hidden mb-8">
                          <div className="absolute inset-0">
                            <Image
                              src={selectedJourney.imageBg}
                              alt={selectedJourney.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-black/30"></div>
                          </div>
                          <div className="relative z-10 p-6 text-white min-h-[200px] flex flex-col justify-end">
                            <h3 className="text-2xl font-brooklyn mb-2">{selectedJourney.title}</h3>
                            <p className="text-white/80 mb-4">{selectedJourney.description}</p>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-lg font-brooklyn text-gray-900 mb-4">Recommended Hotels</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedJourney.hotels.map((hotel) => (
                              <Link 
                                href={`/hotels/${hotel.id}`} 
                                key={hotel.id}
                                className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all group"
                              >
                                <div className="relative w-24 h-24">
                                  <Image
                                    src={hotel.image}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                                  />
                                </div>
                                <div className="p-3 flex flex-col justify-center">
                                  <h5 className="font-brooklyn text-brand-olive-400 group-hover:text-brand-olive-500">{hotel.name}</h5>
                                  <p className="text-sm text-gray-500">{hotel.location}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-brooklyn flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Start Over
                          </button>
                          <Link 
                            href="/contact" 
                            className="px-6 py-2.5 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors flex items-center"
                            onClick={() => setIsOpen(false)}
                          >
                            Book This Journey
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-brooklyn text-gray-700 mb-2">No matching journeys found</h3>
                        <p className="text-gray-500 mb-4 text-center">We couldn't find a perfect match for your preferences.</p>
                        <button 
                          onClick={handleReset}
                          className="px-6 py-2.5 bg-brand-olive-400 text-white rounded-full font-brooklyn hover:bg-brand-olive-500 transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}