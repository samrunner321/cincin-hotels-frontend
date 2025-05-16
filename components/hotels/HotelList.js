'use client';

import HotelCard from './HotelCard';

export default function HotelList({ 
  hotels = [], 
  isLoading = false, 
  error = null,
  title = "Our Hotels" 
}) {
  // Zeige Ladezustand
  if (isLoading) {
    return (
      <section className="py-12" aria-busy="true" aria-label="Loading hotels">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse" aria-hidden="true">
                <div className="bg-gray-200 rounded-xl h-[460px] mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Zeige Fehlerzustand
  if (error) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <h2 className="text-2xl font-normal text-gray-800 mb-4">Unable to load hotels</h2>
            <p className="text-gray-600 mb-6">{error.message || "Please try again later."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  
  // Zeige leeren Zustand
  if (hotels.length === 0) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12 rounded-xl">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h3 className="text-lg font-normal text-gray-900 mb-2">No hotels found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        </div>
      </section>
    );
  }

  // Zeige Hotels
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {hotels.map(hotel => (
            <HotelCard 
              key={hotel.id} 
              {...hotel} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}