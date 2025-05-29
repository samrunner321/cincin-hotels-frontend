'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import moved inside component to access props

export default function DiningSection({ destination, restaurants: propRestaurants, diningData }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // Dynamic import with loading component
  const DiningMap = dynamic(() => import('./DiningMap'), {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-olive-400 mx-auto mb-4"></div>
          <p className="text-gray-500">{diningData?.common_loading_map || 'Loading map...'}</p>
        </div>
      </div>
    )
  });
  
  // Use real restaurants data from props, or fall back to mock data
  const restaurants = propRestaurants && propRestaurants.length > 0 ? propRestaurants.map(r => ({
    id: r.id,
    name: r.name,
    category: r.category || 'restaurant',
    cuisine: r.cuisine_type || r.cuisine || 'International',
    description: r.description,
    image: r.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    price: r.price_level || r.price_range || '€€',
    rating: r.rating,
    location: { lat: r.latitude || 0, lng: r.longitude || 0 },
    mustTry: r.must_try || r.mustTry || ''
  })) : [
    {
      id: 1,
      name: 'Nammos',
      category: 'fine-dining',
      cuisine: 'Mediterranean',
      description: 'Beachfront fine dining with fresh seafood and champagne.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      price: '€€€€',
      rating: 4.8,
      location: { lat: 37.4467, lng: 25.3289 },
      mustTry: 'Lobster Spaghetti'
    },
    {
      id: 2,
      name: 'Funky Kitchen',
      category: 'casual',
      cuisine: 'Greek Fusion',
      description: 'Creative Greek cuisine with a modern twist.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      price: '€€',
      rating: 4.6,
      location: { lat: 37.4456, lng: 25.3278 },
      mustTry: 'Deconstructed Moussaka'
    },
    {
      id: 3,
      name: 'Sunset Taverna',
      category: 'traditional',
      cuisine: 'Traditional Greek',
      description: 'Authentic local dishes with the best sunset views.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      price: '€€',
      rating: 4.7,
      location: { lat: 37.4445, lng: 25.3267 },
      mustTry: 'Fresh Grilled Octopus'
    },
    {
      id: 4,
      name: 'Scorpios',
      category: 'beach-club',
      cuisine: 'Mediterranean',
      description: 'Bohemian beach club with organic Mediterranean fare.',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      price: '€€€',
      rating: 4.5,
      location: { lat: 37.4434, lng: 25.3256 },
      mustTry: 'Whole Fish Salt Crust'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Restaurants' },
    { id: 'fine-dining', name: 'Fine Dining' },
    { id: 'casual', name: 'Casual' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'beach-club', name: 'Beach Clubs' }
  ];

  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.category === selectedCategory);

  return (
    <section id="dining" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            {diningData?.dining_culinary || 'Culinary'} <span className="font-bold">{diningData?.dining_map || 'Map'}</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            {diningData?.dining_subtitle ? (
              <span dangerouslySetInnerHTML={{ __html: diningData.dining_subtitle.replace('{destination}', destination) }} />
            ) : (
              `Discover the finest dining experiences in ${destination}, from Michelin-starred restaurants to hidden local gems.`
            )}
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all text-sm ${
                  selectedCategory === category.id
                    ? 'bg-brand-olive-400 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Restaurant Cards with Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Container */}
            <motion.div
              className="bg-white rounded-2xl overflow-hidden shadow-lg h-[500px] order-2 lg:order-1"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <DiningMap 
                restaurants={filteredRestaurants} 
                selectedRestaurant={selectedRestaurant}
                onRestaurantClick={(restaurant) => setSelectedRestaurant(restaurant)}
              />
            </motion.div>

            {/* Restaurant List */}
            <div className="space-y-4 order-1 lg:order-2">
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-brand-olive-400' : ''
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className="flex">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{restaurant.price}</div>
                          <div className="text-sm text-yellow-500">★ {restaurant.rating}</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {restaurant.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-brand-olive-100 text-brand-olive-600 px-2 py-1 rounded-full">
                          {diningData?.dining_must_try || 'Must Try:'} {restaurant.mustTry}
                        </span>
                        <button className="text-sm text-brand-olive-400 hover:text-brand-olive-600 transition-colors">
                          {diningData?.dining_view_menu || 'View Menu →'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}