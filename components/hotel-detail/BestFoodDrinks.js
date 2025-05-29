'use client';

import Image from 'next/image';

export default function BestFoodDrinks({ restaurants = [] }) {
  // Default restaurant data if none provided
  const defaultRestaurants = [
    {
      id: 1,
      name: "The Olive Garden",
      type: "Fine Dining",
      cuisine_type: "Mediterranean",
      description: "Award-winning cuisine with locally sourced ingredients and panoramic views. Experience the finest Mediterranean flavors crafted by our renowned chef.",
      image: "/images/restaurant-1.jpg",
      rating: 4.8,
      price_level: "€€€€",
      opening_hours: "18:30 - 23:00",
      menu_link: "#"
    },
    {
      id: 2,
      name: "Sunset Bar",
      type: "Bar & Lounge",
      cuisine_type: "Cocktails & Tapas",
      description: "Craft cocktails and small plates with breathtaking sunset views. Our mixologists create unique drinks using local ingredients and international spirits.",
      image: "/images/restaurant-2.jpg",
      rating: 4.6,
      price_level: "€€€",
      opening_hours: "16:00 - 01:00",
      menu_link: "#"
    },
    {
      id: 3,
      name: "Beach Bistro",
      type: "Casual Dining",
      cuisine_type: "Seafood",
      description: "Fresh catches of the day served in a relaxed beachfront setting. Enjoy sustainable seafood prepared with traditional and modern techniques.",
      image: "/images/restaurant-3.jpg",
      rating: 4.5,
      price_level: "€€",
      opening_hours: "12:00 - 22:00",
      menu_link: "#"
    }
  ];

  const displayRestaurants = restaurants.length > 0 ? restaurants : defaultRestaurants;

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3 h-3 ${i < fullStars ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-xs font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <section id="restaurants" className="py-16 bg-gray-50">
      {/* Same container as RoomList */}
      <div className="container mx-auto px-4 max-w-[1500px]">
        <div className="mb-12">
          {/* Same title styling as Rooms & Suites */}
          <h2 className="text-3xl font-light text-center mb-2">Food & Drinks</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
        </div>
        
        {/* Same grid layout as RoomList */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6">
          {displayRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id || index}
              className="transform scale-[0.94] origin-center"
            >
              <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Same image container as RoomCard */}
                <div className="relative aspect-[4/3] group">
                  <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Rating Badge positioned like room badges */}
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md">
                    {renderRating(restaurant.rating)}
                  </div>
                </div>
                
                {/* Same padding as RoomCard */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-medium leading-tight">{restaurant.name}</h3>
                    <div className="text-sm text-gray-600 whitespace-nowrap ml-2">
                      {restaurant.price_level}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine_type}</p>
                  
                  {/* Same text truncation as RoomCard */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">{restaurant.opening_hours}</span>
                    </div>
                    
                    {restaurant.menu_link && (
                      <a 
                        href={restaurant.menu_link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#93A27F] text-white px-4 py-2 hover:bg-[#7d8a6b] transition-colors rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        View Menu
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}