'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function DestinationInteractiveFeatures() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-brand-olive-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-4">Plan Your Perfect Destination Experience</h2>
          <p className="text-gray-600 max-w-3xl mx-auto font-brooklyn">
            Use our interactive tools to discover, explore, and create your ideal journey to any of our carefully selected destinations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Travel Advisor */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl overflow-hidden shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/hotels/hotel-1.jpg"
                alt="AI Travel Advisor"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
                <div className="p-6">
                  <h3 className="text-white text-2xl font-brooklyn mb-2">AI Destination Advisor</h3>
                  <p className="text-white/80 text-sm">Located in bottom right corner</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Our AI Travel Advisor specializes in destination knowledge. Ask questions about any location to get insider tips on:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13V7m0 13l6-3m-6-10l6-3m6 13V7m0 0L15 4m0 0l-6 3m0 0l-6-3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Local Knowledge</h4>
                    <p className="text-gray-600 text-sm">Get recommendations for hidden gems, best times to visit, and local customs.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Destination Comparison</h4>
                    <p className="text-gray-600 text-sm">Compare different destinations to find your perfect match based on your preferences.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Seasonal Advice</h4>
                    <p className="text-gray-600 text-sm">Discover the ideal time to visit any destination based on weather, events, and crowd levels.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-brooklyn text-gray-900 mb-2 text-sm">Try asking:</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 bg-white p-2 rounded-md">"What's the best time to visit the Swiss Alps?"</p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded-md">"Recommend beach destinations with cultural activities"</p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded-md">"Tell me about food in South Tyrol"</p>
                </div>
              </div>

              <button 
                className="w-full py-3 bg-brand-olive-400 text-white rounded-md font-brooklyn hover:bg-brand-olive-500 transition-colors flex items-center justify-center"
                onClick={() => {
                  // Find and trigger the chat button
                  const chatButton = document.querySelector('.fixed.bottom-6.right-6');
                  if (chatButton) chatButton.click();
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Ask Destination Questions
              </button>
            </div>
          </motion.div>

          {/* Journey Designer */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl overflow-hidden shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/images/hotels/hotel-2.jpg"
                alt="Journey Designer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 flex items-end">
                <div className="p-6">
                  <h3 className="text-white text-2xl font-brooklyn mb-2">Destination Journey Planner</h3>
                  <p className="text-white/80 text-sm">Located in bottom left corner</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Design your perfect destination experience with our interactive journey planner, tailored to your travel style and interests:
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Customized Itineraries</h4>
                    <p className="text-gray-600 text-sm">Create personalized travel plans based on your preferences and interests.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Perfect Destination Match</h4>
                    <p className="text-gray-600 text-sm">Discover destinations that align with your travel style and preferences.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-brooklyn text-gray-900 mb-1">Hotel Recommendations</h4>
                    <p className="text-gray-600 text-sm">Get matched with the perfect accommodations in your chosen destination.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-brooklyn text-gray-900 mb-2 text-sm">This tool helps you:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-brand-olive-400 mr-2">•</span>
                    Define your ideal travel experience
                  </li>
                  <li className="flex items-center">
                    <span className="text-brand-olive-400 mr-2">•</span>
                    Discover destinations that match your style
                  </li>
                  <li className="flex items-center">
                    <span className="text-brand-olive-400 mr-2">•</span>
                    Create personalized travel journeys
                  </li>
                  <li className="flex items-center">
                    <span className="text-brand-olive-400 mr-2">•</span>
                    Find the best hotels for your preferences
                  </li>
                </ul>
              </div>

              <button 
                className="w-full py-3 bg-brand-olive-400 text-white rounded-md font-brooklyn hover:bg-brand-olive-500 transition-colors flex items-center justify-center"
                onClick={() => {
                  // Find and trigger the journey designer button
                  const journeyButton = document.querySelector('.fixed.left-6.bottom-6');
                  if (journeyButton) journeyButton.click();
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Design Your Journey
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Additional guidance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 font-brooklyn italic">
            Our interactive tools are available on every page to help you plan your perfect destination experience anytime during your visit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}