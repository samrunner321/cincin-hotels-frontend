import { Suspense } from 'react';
import { getAllHotels, getAllCategories, getAllDestinations } from '../../lib/api';

import HotelList from '../../components/hotels/HotelList';
import CategoryBar from '../../components/hotels/CategoryBar';
import Filters from '../../components/hotels/Filters';
import HotelsHero from '../../components/hotels/Hero';

export const metadata = {
  title: 'Our Hotels - CinCin Hotels',
  description: 'Discover our carefully curated selection of exceptional hotels, from mountain retreats to urban sanctuaries.',
  openGraph: {
    title: 'Our Hotels - CinCin Hotels',
    description: 'Discover our carefully curated selection of exceptional hotels, from mountain retreats to urban sanctuaries.',
    images: [
      {
        url: '/images/og-hotels.jpg',
        width: 1200,
        height: 630,
        alt: 'Our Hotels - CinCin Hotels',
      },
    ],
  },
};

export default async function HotelsPage({ searchParams }) {
  const { category, region, priceMin, priceMax, features } = searchParams;
  
  // Fetch data in parallel
  const [hotelsData, categoriesData, destinationsData] = await Promise.all([
    getAllHotels(),
    getAllCategories(),
    getAllDestinations(),
  ]);

  const hotels = hotelsData.data;
  const categories = categoriesData.data;
  const destinations = destinationsData.data;

  // Extract all regions from destinations
  const regions = destinations.map(destination => ({
    id: destination.slug,
    name: destination.name
  }));

  // Filter hotels based on search params
  let filteredHotels = [...hotels];
  
  // Filter by category
  if (category) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.categories.some(cat => 
        cat.toLowerCase().replace(/\s+/g, '-') === category
      )
    );
  }
  
  // Filter by region
  if (region) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.region?.toLowerCase().replace(/\s+/g, '-') === region
    );
  }
  
  // Filter by price
  if (priceMin) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.price.amount >= Number(priceMin)
    );
  }
  
  if (priceMax) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.price.amount <= Number(priceMax)
    );
  }
  
  // Filter by features (amenities)
  if (features) {
    const featuresList = features.split(',');
    filteredHotels = filteredHotels.filter(hotel => 
      featuresList.every(feature => 
        hotel.amenities?.includes(feature)
      )
    );
  }

  return (
    <main>
      <HotelsHero />
      
      <div id="hotel-listings" className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="h-20"></div>}>
          <CategoryBar />
        </Suspense>
        
        <Filters 
          categories={categories} 
          regions={regions}
          minPrice={0}
          maxPrice={1500}
        />
        
        <HotelList 
          hotels={filteredHotels}
          title={category ? `${category.replace('-', ' ')} Hotels` : 'All Hotels'}
          subtitle={`Showing ${filteredHotels.length} hotels`}
        />
      </div>
    </main>
  );
}