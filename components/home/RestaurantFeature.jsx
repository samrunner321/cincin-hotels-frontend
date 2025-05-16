'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RestaurantFeature({
  title = "CinCin's Picks of the Week: Best Food & Drinks",
  restaurants = [
    {
      id: 1,
      name: "El Olivo",
      description: "A traditional alpine restaurant with a modern twist, offering stunning Matterhorn views.",
      image: "/images/restaurant-1.jpg",
      url: "/restaurants/el-olivo"
    },
    {
      id: 2,
      name: "LA SPONDA",
      description: "A culinary love letter to Naples, Vesuvius & the Amalfi Coast.",
      image: "/images/restaurant-2.jpg",
      url: "/restaurants/la-sponda"
    },
    {
      id: 3,
      name: "LE GRAND VÉFOUR",
      description: "Jewel of the 18th century \"art décoratif\" Le Grand Véfour has been the finest gourmet rendez-vous of the Parisian.",
      image: "/images/restaurant-3.jpg",
      url: "/restaurants/le-grand-vefour"
    },
    {
      id: 4,
      name: "Il Palagio",
      description: "Immerse yourself in an unparalleled dining experience that seamlessly blends culinary mastery, heritage and innovation.",
      image: "/images/restaurant-4.jpg",
      url: "/restaurants/il-palagio"
    }
  ]
}) {
  const [activeRestaurant, setActiveRestaurant] = useState(0);
  const [locked, setLocked] = useState(false);
  const componentRef = useRef(null);

  // Event handler for clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setLocked(false);
        setActiveRestaurant(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler for mouse enter
  const handleMouseEnter = (index) => {
    if (!locked) {
      setActiveRestaurant(index);
    }
  };

  // Handler for click
  const handleClick = (index) => {
    setActiveRestaurant(index);
    setLocked(true);
  };

  return (
    <section className="py-16" style={{ backgroundColor: "#f1f3ee" }} ref={componentRef}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 md:min-h-[500px]">
          {/* Image Column - Takes up 7/12 of the grid */}
          <div className="md:col-span-7 relative h-auto md:h-full rounded-xl overflow-hidden">
            {restaurants.map((restaurant, index) => (
              <div 
                key={restaurant.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === activeRestaurant ? 'block' : 'hidden'
                }`}
                style={{ minHeight: '300px', height: '100%' }}
              >
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58%, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-6 right-6">
                  <Link
                    href={restaurant.url}
                    className="px-6 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors text-sm"
                  >
                    Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Content Column - Takes up 5/12 of the grid */}
          <div className="md:col-span-5 py-4 flex flex-col h-full">
            <h2 className="text-2xl md:text-3xl font-normal mb-10">{title}</h2>
            
            <div className="space-y-5">
              {restaurants.map((restaurant, index) => (
                <div 
                  key={restaurant.id} 
                  className="cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onClick={() => handleClick(index)}
                >
                  <div className={`transition-all duration-200 rounded-md p-2 ${
                    index === activeRestaurant ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                  }`}>
                    <h3 className="text-lg font-normal mb-0.5">{restaurant.name}</h3>
                    <p className={`text-sm leading-tight ${index === activeRestaurant ? 'text-gray-100' : 'text-gray-600'}`}>
                      {restaurant.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}