'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function InteractiveFeatures() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const features = [
    {
      id: 'chatbot',
      title: 'AI Travel Advisor',
      description: 'Our intelligent assistant helps you discover destinations, find perfect accommodations, and plan your journey with personalized recommendations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      position: 'right',
      image: '/images/hotels/hotel-6.jpg',
      features: [
        'Personalized destination recommendations',
        'Hotel suggestions based on your preferences',
        'Insider travel tips and local insights',
        'Available 24/7 for your travel questions'
      ]
    },
    {
      id: 'journey-designer',
      title: 'Journey Designer',
      description: 'Create your perfect trip with our interactive tool that builds a customized travel experience based on your preferences and interests.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      position: 'left',
      image: '/images/hotels/hotel-3.jpg',
      features: [
        'Visually design your perfect travel experience',
        'Get matched with ideal destinations and hotels',
        'Customize based on season, traveler type, and interests',
        'Instantly access your personalized journey plan'
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1536px]">
        <motion.div 
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-brooklyn mb-4"
          >
            Interactive Travel Tools
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-3xl mx-auto font-brooklyn"
          >
            Discover our innovative digital features designed to enhance your travel planning experience and make booking your next adventure effortless.
          </motion.p>
        </motion.div>

        <div className="space-y-20">
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containerVariants}
              className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center"
            >
              {/* Image (changes position based on feature.position) */}
              <motion.div 
                variants={itemVariants}
                className={`lg:w-1/2 order-2 ${feature.position === 'left' ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <div className="relative h-[350px] w-full rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end ${feature.position === 'left' ? 'text-left' : 'text-right'}`}>
                    <div className="p-6 w-full">
                      <p className="text-white text-sm md:text-base font-brooklyn">
                        {feature.id === 'chatbot' ? 'Located in bottom right of every page' : 'Located in bottom left of every page'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Content */}
              <motion.div 
                variants={itemVariants}
                className={`lg:w-1/2 order-1 ${feature.position === 'left' ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-brand-olive-400 rounded-full flex items-center justify-center text-white mr-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-brooklyn text-gray-900">{feature.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6 font-brooklyn">{feature.description}</p>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-brooklyn text-gray-900 mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {feature.features.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                        className="flex items-start"
                      >
                        <svg className="w-5 h-5 text-brand-olive-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex items-center text-brand-olive-400 font-brooklyn hover:text-brand-olive-600 transition-colors`}
                    onClick={() => {
                      // Highlight the feature by showing a pulse animation
                      const el = document.querySelector(`.${feature.id === 'chatbot' ? 'fixed.bottom-6.right-6' : 'fixed.left-6.bottom-6'}`);
                      if (el) {
                        el.classList.add('animate-pulse');
                        setTimeout(() => {
                          el.classList.remove('animate-pulse');
                        }, 2000);
                      }
                    }}
                  >
                    <span>Try it now</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Usage instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 bg-white p-8 rounded-xl border border-gray-100 shadow-sm"
        >
          <h3 className="text-xl font-brooklyn text-center text-gray-900 mb-2">How to Use Our Interactive Tools</h3>
          <p className="text-gray-600 text-center mb-8">Find these tools conveniently accessible on every page of our website.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-brand-olive-50 flex items-center justify-center text-brand-olive-400 mr-4 flex-shrink-0">
                <span className="text-xl font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-brooklyn text-gray-900 mb-2">Look for the Chat Icon</h4>
                <p className="text-gray-600 text-sm">Find the chat bubble icon in the bottom right corner of any page to access our AI Travel Advisor.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-brand-olive-50 flex items-center justify-center text-brand-olive-400 mr-4 flex-shrink-0">
                <span className="text-xl font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-brooklyn text-gray-900 mb-2">Try the Journey Designer</h4>
                <p className="text-gray-600 text-sm">Click the "Design Your Journey" button in the bottom left corner to create a customized travel plan.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-brand-olive-50 flex items-center justify-center text-brand-olive-400 mr-4 flex-shrink-0">
                <span className="text-xl font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-brooklyn text-gray-900 mb-2">Ask Travel Questions</h4>
                <p className="text-gray-600 text-sm">Inquire about destinations, accommodation options, local activities, or get personalized recommendations.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-12 h-12 rounded-full bg-brand-olive-50 flex items-center justify-center text-brand-olive-400 mr-4 flex-shrink-0">
                <span className="text-xl font-semibold">4</span>
              </div>
              <div>
                <h4 className="font-brooklyn text-gray-900 mb-2">Customize Your Experience</h4>
                <p className="text-gray-600 text-sm">Follow the interactive prompts to tailor recommendations to your specific travel preferences and needs.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}