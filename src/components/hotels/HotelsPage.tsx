// @ts-nocheck
'use client';

// Keep the existing types for backward compatibility
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the interface for the Hotel object for type safety
export interface Hotel {
  id: string;
  name: string;
  location: string;
  description?: string;
  short_description?: string;
  slug: string;
  main_image_url?: string;
  image?: string;
  categories?: Array<{id: string, name: string}> | string[];
  price_from?: number;
}

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

/**
 * HotelsPage Komponente
 * 
 * Eine Seite zur Anzeige von Hotels mit Suchfunktion, Filtern und verschiedenen Ansichtsoptionen
 */
export default function HotelsPage(): JSX.Element {
  // UI-State-Context
  const { state: uiState, setViewMode } = useUIState();
  
  // State für Hotels
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // State für Filter und Suchfunktion
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    experiences: [] as string[]
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State für das Filter-Modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  
  // State für Preisbereich
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 2000,
    currentMin: 0,
    currentMax: 2000
  });
  
  // Hotels laden
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      
      try {
        // Verzögerung simulieren
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In einer echten App wäre dies ein API-Aufruf
        const response = SAMPLE_HOTELS as Hotel[];
        
        setHotels(response);
        setFilteredHotels(response);
        
        // Preisbereich aus den Daten ermitteln
        const prices = response
          .filter(hotel => hotel.price_from)
          .map(hotel => hotel.price_from as number);
          
        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices) / 10) * 10; // Auf 10er abrunden
          const max = Math.ceil(Math.max(...prices) / 10) * 10;  // Auf 10er aufrunden
          
          setPriceRange({
            min,
            max,
            currentMin: min,
            currentMax: max
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(new Error("Hotels konnten nicht geladen werden. Bitte versuchen Sie es später erneut."));
        setIsLoading(false);
      }
    };
    
    fetchHotels();
  }, []);
  
  // Suchfunktion
  const handleSearch = async (query: string): Promise<void> => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // Bei leerer Suche alle Hotels anzeigen (mit aktiven Filtern)
      setFilteredHotels(applyFilters(hotels, activeFilters));
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = hotels.filter(hotel => 
      hotel.name.toLowerCase().includes(lowerQuery) || 
      hotel.location.toLowerCase().includes(lowerQuery) ||
      (hotel.description && hotel.description.toLowerCase().includes(lowerQuery)) ||
      (hotel.categories && hotel.categories.some(cat => 
        (typeof cat === 'string' ? cat : cat.name).toLowerCase().includes(lowerQuery)
      ))
    );
    
    setFilteredHotels(applyFilters(results, activeFilters));
  };
  
  // Filter anwenden
  const applyFilters = (hotelList: Hotel[], filters: any) => {
    if (!filters || Object.values(filters).every((arr: any) => arr.length === 0)) {
      return hotelList;
    }
    
    return hotelList.filter(hotel => {
      // Kategorie-Filter
      if (filters.categories && filters.categories.length > 0) {
        const hotelCategories = hotel.categories?.map(cat => 
          typeof cat === 'string' ? cat.toLowerCase() : cat.id.toLowerCase()
        ) || [];
        
        if (!filters.categories.some((catId: string) => 
          hotelCategories.includes(catId.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Standort-Filter
      if (filters.locations && filters.locations.length > 0) {
        const hotelLocation = hotel.location?.toLowerCase() || '';
        
        if (!filters.locations.some((loc: string) => 
          hotelLocation.includes(loc.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Erlebnis-Filter
      if (filters.experiences && filters.experiences.length > 0) {
        // Hier könnte eine Implementierung für Erlebnisse eingefügt werden
        // Beispiel: Prüfen, ob ein Hotel bestimmte Erlebnisse anbietet
      }
      
      // Preisbereich-Filter
      if (hotel.price_from) {
        if (hotel.price_from < priceRange.currentMin || hotel.price_from > priceRange.currentMax) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Filter ändern
  const handleFilterChange = (newFilters: any): void => {
    setActiveFilters(newFilters);
    
    // Sowohl Filter als auch Suche anwenden
    const searchResults = searchQuery 
      ? hotels.filter(hotel => 
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : hotels;
      
    setFilteredHotels(applyFilters(searchResults, newFilters));
  };
  
  // Preisbereich ändern
  const handlePriceRangeChange = (min: number, max: number): void => {
    setPriceRange(prev => ({
      ...prev,
      currentMin: min,
      currentMax: max
    }));
    
    // Erneute Anwendung der Filter mit neuem Preisbereich
    const searchResults = searchQuery 
      ? hotels.filter(hotel => 
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          hotel.location?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : hotels;
      
    setFilteredHotels(applyFilters(searchResults, activeFilters));
  };
  
  // Ansichtsmodus ändern
  const handleViewModeChange = (mode: ViewType): void => {
    setViewMode(mode);
  };
  
  // Hotel-Klick
  const handleHotelClick = (hotel: Hotel): void => {
    // In einer echten App könnte hier die Navigation zu einer Detailseite erfolgen
    // oder ein Modal geöffnet werden
    console.log('Hotel clicked:', hotel);
  };
  
  // Lade-Zustand
  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border a-200 rounded-full border-t-black"></div>
      </div>
    );
  }
  
  // Fehler-Zustand
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8">
          <h2 className="text-xl font-normal text-red-800 mb-4">Fehler beim Laden</h2>
          <p className="text-red-600 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }
  
  // Animations-Einstellungen
  const shouldAnimate = !uiState.theme.reducedMotion && uiState.theme.animationsEnabled;
  
  return (
    <main>
      {/* Hero-Bereich */}
      <section className="bg-gradient-to-b from-gray-100 to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-light mb-6">Außergewöhnliche Hotels</h1>
            <p className="text-xl text-gray-600">
              Entdecken Sie unsere handverlesene Kollektion außergewöhnlicher Unterkünfte an 
              Europas faszinierendsten Reisezielen.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Filter und Suche */}
      <HotelFilters 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialSearchQuery={searchQuery}
        activeFilters={activeFilters}
        className="sticky top-0 z-10"
      />
      
      {/* Hauptinhalt */}
      <section className="container mx-auto px-4 py-8">
        {/* Anzahl der Ergebnisse und Ansichtsumschalter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-light">
              {searchQuery ? `Suchergebnisse für "${searchQuery}"` : "Unsere Kollektion"}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredHotels.length} {filteredHotels.length === 1 ? 'Hotel gefunden' : 'Hotels gefunden'}
            </p>
          </div>
          
          <ViewSwitcher 
            onChange={handleViewModeChange}
            defaultView={uiState.viewMode as ViewType}
            className="mt-4 md:mt-0"
          />
        </div>
        
        {/* Keine Ergebnisse */}
        {filteredHotels.length === 0 && (
          <div className="py-12 bg-gray-50 rounded-xl text-center">
            <div className="max-w-md mx-auto">
              <svg 
                className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              <h3 className="text-xl font-normal text-gray-900 mb-2">Keine Hotels gefunden</h3>
              <p className="text-gray-600 mb-6">Bitte passen Sie Ihre Filter an oder versuchen Sie eine andere Suche.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters({
                    categories: [],
                    locations: [],
                    experiences: []
                  });
                  setPriceRange(prev => ({
                    ...prev,
                    currentMin: prev.min,
                    currentMax: prev.max
                  }));
                  setFilteredHotels(hotels);
                }}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Filter zurücksetzen
              </button>
            </div>
          </div>
        )}
        
        {/* Hotelliste oder Grid */}
        {filteredHotels.length > 0 && (
          <>
            {uiState.viewMode === 'list' ? (
              <HotelListView hotels={filteredHotels} onHotelClick={handleHotelClick} />
            ) : uiState.viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredHotels.map((hotel, index) => (
                  <motion.div
                    key={hotel.id}
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5,
                      delay: shouldAnimate ? index * 0.1 : 0,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <HotelCard 
                      id={hotel.id}
                      name={hotel.name}
                      location={hotel.location}
                      description={hotel.short_description || hotel.description}
                      image={hotel.main_image_url || hotel.image}
                      categories={hotel.categories}
                      slug={hotel.slug}
                      price_from={hotel.price_from}
                      onClick={() => handleHotelClick(hotel)}
                      maxDescriptionLength={100}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-6 h-[60vh] flex items-center justify-center">
                <p className="text-gray-600">Kartenansicht wird geladen...</p>
                {/* Hier würde in einer echten App die Kartenkomponente geladen werden */}
              </div>
            )}
          </>
        )}
      </section>
      
      {/* Erweitertes Filter-Modal */}
      <AdvancedFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        activeFilters={activeFilters}
        priceRange={priceRange}
        onFilterChange={handleFilterChange}
        onPriceRangeChange={handlePriceRangeChange}
      />
    </main>
  );
}