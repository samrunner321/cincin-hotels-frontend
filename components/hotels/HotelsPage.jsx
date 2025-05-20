'use client';

import { useState, useEffect } from 'react';
import HotelsHero from './HotelsHero';
import HotelFilters from './HotelFilters';
import HotelGrid from './HotelGrid';

// Sample data for demonstration - this would be fetched from an API in a real implementation
const SAMPLE_HOTELS = [
  {
    id: '1',
    name: 'Hotel Schgaguler',
    location: 'Castelrotto, South Tyrol',
    description: 'A sleek, modernist hotel nestled in the heart of the Dolomites, combining alpine tradition with contemporary design.',
    short_description: 'Alpine modernism in the heart of the Dolomites',
    slug: 'hotel-schgaguler',
    main_image_url: '/images/hotels/hotel-schgaguler.jpg',
    categories: [
      { id: 'mountains', name: 'Mountains' },
      { id: 'design', name: 'Design' }
    ],
    price_from: 320
  },
  {
    id: '2',
    name: 'Giardino Marling',
    location: 'Merano, South Tyrol',
    description: 'Set within Mediterranean gardens with breathtaking panoramic views of the Merano valley, this luxury retreat offers exceptional cuisine and wellness.',
    short_description: 'Mediterranean luxury with alpine panoramas',
    slug: 'giardino-marling',
    main_image_url: '/images/hotels/hotel-giardino.jpg',
    categories: [
      { id: 'spa', name: 'Spa & Wellness' },
      { id: 'culinary', name: 'Fine Dining' }
    ],
    price_from: 280
  },
  {
    id: '3',
    name: 'Hotel Aurora',
    location: 'Lech, Austria',
    description: 'An elegant luxury hotel in the world-famous ski resort of Lech am Arlberg, offering exceptional service and ski-in/ski-out access.',
    short_description: 'Sophisticated luxury in the heart of Lech',
    slug: 'hotel-aurora',
    main_image_url: '/images/hotels/hotel-aurora.jpg',
    categories: [
      { id: 'mountains', name: 'Mountains' },
      { id: 'luxury', name: 'Luxury' }
    ],
    price_from: 450
  },
  {
    id: '4',
    name: 'rocksresort',
    location: 'Laax, Switzerland',
    description: 'A minimalist architectural masterpiece at the foot of the slopes, offering immediate access to Switzerland\'s premier snowboarding destination.',
    short_description: 'Contemporary architectural gem in the Swiss Alps',
    slug: 'rocksresort',
    main_image_url: '/images/hotels/hotel-rockresort.jpg',
    categories: [
      { id: 'mountains', name: 'Mountains' },
      { id: 'design', name: 'Design' }
    ],
    price_from: 220
  },
  {
    id: '5',
    name: 'Casa Rottapharm',
    location: 'Lake Garda, Italy',
    description: 'A boutique villa hotel on the shores of Lake Garda, with elegant design, lush gardens, and a private beach area.',
    short_description: 'Lakeside elegance with Italian charm',
    slug: 'casa-rottapharm',
    main_image_url: '/images/hotels/hotel-5.jpg',
    categories: [
      { id: 'boutique', name: 'Boutique' },
      { id: 'lake', name: 'Lakeside' }
    ],
    price_from: 390
  },
  {
    id: '6',
    name: 'Grand Hotel Milano',
    location: 'Milan, Italy',
    description: 'Located in the heart of Milan\'s fashion district, this historic hotel combines rich heritage with contemporary luxury and exceptional service.',
    short_description: 'Historical luxury in Milan\'s fashion district',
    slug: 'grand-hotel-milano',
    main_image_url: '/images/hotels/hotel-6.jpg',
    categories: [
      { id: 'city', name: 'City' },
      { id: 'luxury', name: 'Luxury' }
    ],
    price_from: 480
  }
];

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    locations: [],
    experiences: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulate API fetch
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        const response = SAMPLE_HOTELS;
        
        setHotels(response);
        setFilteredHotels(response);
        setIsLoading(false);
      } catch (err) {
        setError({ message: "Failed to load hotels. Please try again later." });
        setIsLoading(false);
      }
    };
    
    fetchHotels();
  }, []);
  
  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Reset to all hotels if search is cleared
      setFilteredHotels(applyFilters(hotels, activeFilters));
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(lowerQuery) || 
      hotel.location.toLowerCase().includes(lowerQuery) ||
      (hotel.description && hotel.description.toLowerCase().includes(lowerQuery)) ||
      hotel.categories.some(cat => 
        (typeof cat === 'string' ? cat : cat.name).toLowerCase().includes(lowerQuery)
      )
    );
    
    setFilteredHotels(applyFilters(results, activeFilters));
  };
  
  // Apply filters to hotels
  const applyFilters = (hotelList, filters) => {
    if (!filters || Object.values(filters).every(arr => arr.length === 0)) {
      return hotelList;
    }
    
    return hotelList.filter(hotel => {
      // Category filter
      if (filters.categories.length > 0) {
        const hotelCategories = hotel.categories.map(cat => 
          typeof cat === 'string' ? cat.toLowerCase() : cat.id.toLowerCase()
        );
        
        if (!filters.categories.some(catId => 
          hotelCategories.includes(catId.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Location filter
      if (filters.locations.length > 0) {
        const hotelLocation = hotel.location.toLowerCase();
        
        if (!filters.locations.some(loc => 
          hotelLocation.includes(loc.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Experience filter could be implemented similarly
      
      return true;
    });
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    
    // Apply both filters and search
    const searchResults = searchQuery 
      ? hotels.filter(hotel => 
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : hotels;
      
    setFilteredHotels(applyFilters(searchResults, newFilters));
  };
  
  return (
    <main>
      <HotelsHero 
        title="Exceptional Hotels"
        subtitle="Discover our handpicked collection of extraordinary accommodations across Europe's most captivating destinations."
      />
      
      <HotelFilters 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialSearchQuery={searchQuery}
        activeFilters={activeFilters}
      />
      
      <HotelGrid 
        hotels={filteredHotels}
        isLoading={isLoading}
        error={error}
        title={searchQuery ? `Search Results for "${searchQuery}"` : "Our Collection"}
      />
    </main>
  );
}