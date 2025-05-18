'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FeatureItem from './FeatureItem';

export default function OverviewSection({ 
  hotelDescription = "Perched at 2,112 meters in Crans-Montana, Chetzeron blends sustainable luxury with alpine charm. This transformed gondola station offers ski-in/ski-out access, a serene spa with an outdoor pool, and gourmet cuisine celebrating local Valais flavors—all framed by breathtaking views of the Matterhorn and Mont-Blanc.",
  features = [
    {
      icon: "mountains",
      title: "Mountains",
      description: "Spectacular alpine views of surrounding mountains."
    },
    {
      icon: "pool",
      title: "Infinity Pool",
      description: "Heated outdoor infinity pool with panoramic views."
    },
    {
      icon: "spa",
      title: "Wellness Spa",
      description: "Luxurious spa with sauna, steam room, and treatments."
    },
    {
      icon: "restaurant",
      title: "Fine Dining",
      description: "Farm-to-table cuisine featuring local ingredients."
    },
    {
      icon: "beach",
      title: "Beachfront",
      description: "Private access to pristine beaches."
    },
    {
      icon: "family",
      title: "Family Friendly",
      description: "Activities and amenities for all ages."
    }
  ],
  highlights = [
    "Sustainably designed architecture blending perfectly with the natural surroundings",
    "Panoramic views from every room and public space",
    "Seasonal activities including skiing, hiking, and mountain biking",
    "Award-winning restaurant featuring locally-sourced ingredients",
    "Wellness center with alpine-inspired treatments"
  ],
  additionalInfo = {
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    roomCount: "45",
    languages: ["English", "German", "French", "Italian"],
    paymentOptions: ["Credit Cards", "Cash", "Bank Transfer"],
    bestFor: ["Couples", "Families", "Wellness", "Adventure"]
  }
}) {
  const [activeTab, setActiveTab] = useState('facilities');
  const [showFeatures, setShowFeatures] = useState(false);
  // Entferne den isSticky-State, da wir einfach nur reguläre Tabs brauchen
  
  const tabs = [
    { id: 'facilities', label: 'Facilities' },
    { id: 'description', label: 'Description' },
    { id: 'info', label: 'Hotel Info' }
  ];
  
  return (
    <section id="overview" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-brooklyn">Hotel Overview</h2>
          <button className="bg-brand-olive-400 text-white font-brooklyn rounded-full px-6 py-2.5 text-sm hover:bg-brand-olive-500 transition-colors shadow-sm">
            Contact Hotel
          </button>
        </div>
        
        {/* Overview Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8">
            {/* Tabs Navigation - Vereinfacht und nicht mehr sticky */}
            <div className="border-b border-gray-200 mb-8 bg-white">
              <div className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 relative font-brooklyn transition-colors ${
                      activeTab === tab.id 
                        ? 'text-brand-olive-400 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-olive-400' 
                        : 'text-gray-600 hover:text-brand-olive-400'
                    }`}
                    aria-selected={activeTab === tab.id}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description Tab */}
            <div className={`${activeTab === 'description' ? 'block' : 'hidden'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-700 leading-relaxed mb-8 font-brooklyn">
                  {hotelDescription}
                </p>
                
                <h3 className="text-xl font-brooklyn mb-4">Hotel Highlights</h3>
                <ul className="space-y-3 mb-8">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-brand-olive-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 font-brooklyn">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-brooklyn mb-4">Location</h3>
                <div className="mb-8">
                  <div className="rounded-2xl overflow-hidden h-[300px]">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.990573938649!2d7.4599542!3d46.9520876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478fbe18c35bb4d5%3A0xe4d9d93be11d0d51!2sBern%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Facilities Tab */}
            <div className={`${activeTab === 'facilities' ? 'block' : 'hidden'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <FeatureItem 
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                      />
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="flex items-center font-brooklyn text-brand-olive-400 hover:text-brand-olive-600 transition-colors"
                >
                  <svg 
                    className={`mr-2 w-4 h-4 transition-transform ${showFeatures ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>{showFeatures ? 'Show Less' : 'Show More Facilities'}</span>
                </button>
                
                {showFeatures && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-brooklyn font-medium mb-3">Room Amenities</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Air conditioning</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Free Wi-Fi</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Minibar</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Smart TV</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Premium bedding</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-brooklyn font-medium mb-3">Hotel Services</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">24-hour reception</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Room service</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Concierge</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Laundry service</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Airport transfers</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-brooklyn font-medium mb-3">Recreation</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Outdoor pool</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Fitness center</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Spa and wellness</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Sauna</span>
                          </li>
                          <li className="flex items-center text-gray-700">
                            <svg className="w-3 h-3 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-brooklyn">Yoga classes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Info Tab */}
            <div className={`${activeTab === 'info' ? 'block' : 'hidden'}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl"
              >
                <dl className="divide-y divide-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Check-in</dt>
                    <dd className="font-brooklyn">{additionalInfo.checkIn}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Check-out</dt>
                    <dd className="font-brooklyn">{additionalInfo.checkOut}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Number of rooms</dt>
                    <dd className="font-brooklyn">{additionalInfo.roomCount}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Languages spoken</dt>
                    <dd className="font-brooklyn">{additionalInfo.languages.join(", ")}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Payment options</dt>
                    <dd className="font-brooklyn">{additionalInfo.paymentOptions.join(", ")}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Best for</dt>
                    <dd className="font-brooklyn">{additionalInfo.bestFor.join(", ")}</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Pets</dt>
                    <dd className="font-brooklyn">Pets allowed (charges may apply)</dd>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 py-4">
                    <dt className="font-brooklyn text-gray-600">Internet</dt>
                    <dd className="font-brooklyn">Complimentary WiFi throughout the hotel</dd>
                  </div>
                </dl>
              </motion.div>
            </div>
          </div>
          
          {/* Sidebar - Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-[144px] bg-white">
              <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-brooklyn mb-3">About This Hotel</h3>
                <p className="text-gray-700 font-brooklyn mb-4 leading-relaxed text-sm">
                  Nestled in the heart of the Alps, this boutique mountain retreat offers a perfect blend of luxury and natural beauty. With its striking architecture and commitment to sustainability, it's an ideal destination for travelers seeking both adventure and relaxation.
                </p>
                <p className="text-gray-700 font-brooklyn leading-relaxed text-sm">
                  The hotel's carefully curated interiors feature local materials and artisanal craftsmanship, creating an atmosphere of refined alpine elegance. Every detail has been thoughtfully considered to ensure an exceptional guest experience.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-brand-olive-50 p-5 rounded-xl text-center">
                  <div className="text-brand-olive-400 mb-1">
                    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="font-brooklyn text-lg">4.9/5</div>
                  <div className="text-xs text-gray-600 font-brooklyn">Guest Rating</div>
                </div>
                
                <div className="bg-brand-olive-50 p-5 rounded-xl text-center">
                  <div className="text-brand-olive-400 mb-1">
                    <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="font-brooklyn text-lg">Central</div>
                  <div className="text-xs text-gray-600 font-brooklyn">Location</div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-brooklyn mb-2">Book Direct Benefits</h3>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-brooklyn text-sm">Best rate guarantee</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-brooklyn text-sm">Free room upgrade when available</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 text-brand-olive-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-brooklyn text-sm">Early check-in and late checkout</span>
                    </li>
                  </ul>
                  <a 
                    href="#rooms" 
                    className="block text-center bg-brand-olive-400 text-white py-3 rounded-full hover:bg-brand-olive-500 transition-colors font-brooklyn shadow-sm"
                  >
                    Check Availability
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}