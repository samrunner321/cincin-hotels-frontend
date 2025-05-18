'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function DiningSection({ destination }) {
  const { dining } = destination;
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [viewStyle, setViewStyle] = useState('map'); // 'map' or 'grid'
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Culinary Journey</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore the vibrant culinary scene of {destination.name}, where tradition meets innovation
            and local flavors are elevated by world-class chefs.
          </p>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setViewStyle('map')}
              className={`px-4 py-2 rounded-full transition-all ${viewStyle === 'map' 
                ? 'bg-[#93A27F] text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Culinary Map
            </button>
            <button 
              onClick={() => setViewStyle('grid')}
              className={`px-4 py-2 rounded-full transition-all ${viewStyle === 'grid' 
                ? 'bg-[#93A27F] text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              Signature Dishes
            </button>
          </div>
        </motion.div>

        {viewStyle === 'map' ? (
          <CulinaryMap 
            restaurants={dining.restaurants} 
            activeHotspot={activeHotspot}
            setActiveHotspot={setActiveHotspot}
            isInView={isInView}
          />
        ) : (
          <SignatureDishes 
            dishes={dining.signatureDishes}
            isInView={isInView}
          />
        )}

        <ChefSpotlight 
          chef={dining.featuredChef}
          isInView={isInView}
        />
      </div>
    </section>
  );
}

function CulinaryMap({ restaurants, activeHotspot, setActiveHotspot, isInView }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-16 relative"
    >
      <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl bg-gray-100">
        <Image
          src="/images/destinations/crans-montana/culinary-map.jpg"
          alt="Culinary map of the region"
          fill
          className="object-cover"
        />
        
        {restaurants.map((restaurant, index) => (
          <Hotspot
            key={index}
            restaurant={restaurant}
            isActive={activeHotspot === index}
            onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
          />
        ))}
      </div>

      {activeHotspot !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 p-6 bg-white rounded-lg shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                src={restaurants[activeHotspot].image}
                alt={restaurants[activeHotspot].name}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-medium text-gray-900 mb-2">{restaurants[activeHotspot].name}</h3>
              <div className="flex items-center mb-3">
                <div className="text-sm bg-[#93A27F] text-white px-2 py-0.5 rounded-full mr-2">
                  {restaurants[activeHotspot].cuisine}
                </div>
                <div className="text-sm text-gray-600">
                  {restaurants[activeHotspot].priceRange}
                </div>
              </div>
              <p className="text-gray-700 mb-4">{restaurants[activeHotspot].description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {restaurants[activeHotspot].location}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Hotspot({ restaurant, isActive, onClick }) {
  return (
    <button
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 group`}
      style={{ left: `${restaurant.coordinates.x}%`, top: `${restaurant.coordinates.y}%` }}
      onClick={onClick}
    >
      <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#93A27F] border-2 ${isActive ? 'border-white scale-150' : 'border-transparent scale-100'} 
        shadow-lg transition-all duration-300 group-hover:scale-125`}>
      </div>
      <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-lg text-sm whitespace-nowrap
        pointer-events-none transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {restaurant.name}
      </div>
    </button>
  );
}

function SignatureDishes({ dishes, isInView }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-16"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] relative">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-medium text-gray-900 mb-2">{dish.name}</h3>
              <p className="text-sm text-[#93A27F] mb-3">{dish.restaurant}</p>
              <p className="text-gray-700 text-sm">{dish.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ChefSpotlight({ chef, isInView }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-gray-50 rounded-xl overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-square md:aspect-auto">
          <Image
            src={chef.image}
            alt={chef.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="text-5xl text-[#93A27F] font-serif mb-6">"</div>
          <blockquote className="text-xl md:text-2xl font-light text-gray-800 mb-6 italic">
            {chef.quote}
          </blockquote>
          <div className="mt-auto">
            <h3 className="text-xl font-medium text-gray-900">{chef.name}</h3>
            <p className="text-[#93A27F]">{chef.restaurant}</p>
            <p className="text-gray-600 mt-1 text-sm">{chef.accolades}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}