import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import DiscoverDestinations from '@/components/home/DiscoverDestinations';
import DestinationCategories from '@/components/home/DestinationCategories';
import HotelCategories from '@/components/home/HotelCategories';
import WorldMapSection from '@/components/home/WorldMapSection';
import { fetchHotelCategories } from '@/lib/hotel-categories';
import { fetchDestinationCategories } from '@/lib/destination-categories';
import { fetchFeaturedHotel } from '@/lib/featured-hotel';
import { getFeaturedRestaurants, getHotelsForMap, getAllDestinations, getAllHotels } from '@/lib/api';

// Dynamischer Import der ErrorBoundary für isolierte Fehlerbehandlung
const ErrorBoundary = dynamic(() => import('@/components/error/ErrorBoundary'), { ssr: false });

// Dynamisches Importieren für Client-Komponenten mit ssr: true für bessere Hydration
const Hero = dynamic(() => import('@/components/home/Hero'), { ssr: true });
const FeaturedHotel = dynamic(() => import('@/components/home/FeaturedHotel'), { ssr: true });
const PopularDestinations = dynamic(() => import('@/components/home/PopularDestinations'), { ssr: true });
const RestaurantFeature = dynamic(() => import('@/components/home/RestaurantFeature'), { ssr: true });
const JournalSection = dynamic(() => import('@/components/home/JournalSection'), { ssr: true });
const NewsletterSignup = dynamic(() => import('@/components/home/NewsletterSignup'), { ssr: true });

// Datenabruffunktion für Server-Komponenten
async function getData(locale) {
  // Fetch real data from Directus
  const hotelCategories = await fetchHotelCategories();
  const destinationCategories = await fetchDestinationCategories();
  let featuredHotel = await fetchFeaturedHotel(locale);
  
  // Fallback für Kempinski Hotel wenn fetchFeaturedHotel null zurückgibt
  if (!featuredHotel) {
    console.log('Using Kempinski fallback data');
    featuredHotel = {
      id: 5,
      name: "Kempinski Hotel Berchtesgaden",
      slug: "kempinski-berchtesgaden",
      location: "Berchtesgaden, Bayern",
      description: locale === 'de' 
        ? "Erleben Sie alpinen Luxus im Kempinski Hotel Berchtesgaden. Eingebettet in die majestätische Berglandschaft der bayerischen Alpen bietet unser 5-Sterne-Hotel erstklassigen Service und atemberaubende Bergblicke."
        : "Experience alpine luxury at Kempinski Hotel Berchtesgaden. Nestled in the majestic mountain landscape of the Bavarian Alps, our 5-star hotel offers exceptional service and breathtaking mountain views.",
      shortDescription: locale === 'de'
        ? "Alpiner Luxus mit spektakulären Bergblicken"
        : "Alpine luxury with spectacular mountain views",
      images: [
        "/images/hotels/hotel-1.jpg",
        "/images/hotels/hotel-2.jpg",
        "/images/hotels/hotel-3.jpg"
      ],
      tag: locale === 'de' ? 'Neu im Club' : 'New to the Club',
      featured: true
    };
  }
  
  const restaurantsResult = await getFeaturedRestaurants(locale, 4);
  const mapRegions = await getHotelsForMap();
  
  // Fetch real destinations data
  const destinationsData = await getAllDestinations(locale);
  const destinations = destinationsData.data || [];
  
  // Get featured destination (first one or specific one)
  const featuredDestination = destinations.find(d => d.slug === 'mykonos') || destinations[0] || {
    name: "Mykonos",
    image: "/images/destinations/beach.jpg",
    url: "/destinations/mykonos"
  };
  
  // Fetch hotels for popular destinations section
  const hotelsData = await getAllHotels(locale);
  const hotels = hotelsData.data || [];
  
  // Get first 4 published hotels
  const popularHotels = hotels.slice(0, 4).map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    image: hotel.image,
    url: `/hotels/${hotel.slug}`
  }));
  
  return {
    featuredHotel,
    destinations: {
      featured: {
        name: featuredDestination.name,
        image: featuredDestination.image,
        url: `/destinations/${featuredDestination.slug}`
      },
      hotels: popularHotels.length > 0 ? popularHotels : [
        {
          id: 1,
          name: "Schgaguler Hotel",
          image: "/images/hotel-schgaguler.jpg",
          url: "/hotels/schgaguler-hotel"
        },
        {
          id: 2,
          name: "Rockresort",
          image: "/images/hotel-rockresort.jpg",
          url: "/hotels/rockresort"
        },
        {
          id: 3,
          name: "Giardino Mountain",
          image: "/images/hotel-giardino.jpg",
          url: "/hotels/giardino-mountain"
        },
        {
          id: 4,
          name: "Aurora Spa Villas",
          image: "/images/hotel-aurora.jpg",
          url: "/hotels/aurora-spa-villas"
        }
      ]
    },
    hotelCategories,
    destinationCategories,
    restaurantPicks: restaurantsResult.data || [
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
    ],
    journalArticles: [
      {
        id: 1,
        title: "The Best Cities for Café Culture",
        category: "Destinations",
        excerpt: "From historic coffee houses to modern artisan roasters, these destinations serve unforgettable experiences with every cup.",
        image: "/images/journal-1.png",
        url: "/journal/best-cities-cafe-culture"
      },
      {
        id: 2,
        title: "Architectural Marvels: Hotels in Historic Buildings",
        category: "Design",
        excerpt: "Discover hotels that breathe new life into historic structures while preserving their architectural heritage.",
        image: "/images/journal-2.png",
        url: "/journal/hotels-historic-buildings"
      },
      {
        id: 3,
        title: "Farm-to-Table: Europe's Best Culinary Destinations",
        category: "Food",
        excerpt: "Experience the freshest local ingredients transformed by innovative chefs across Europe's culinary hotspots.",
        image: "/images/journal-3.png",
        url: "/journal/europe-culinary-destinations"
      }
    ],
    mapRegions
  };
}

export default async function HomePage({ params }) {
  const locale = params?.locale || 'en';
  const { featuredHotel, destinations, hotelCategories, destinationCategories, restaurantPicks, journalArticles, mapRegions } = await getData(locale);
  
  return (
    <>
      {/* Verwende zwei Suspense-Boundaries für bessere Ladeerfahrung */}
      <ErrorBoundary id="hero-section">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading hero section...</div>}>
          <Hero />
          <DiscoverDestinations />
          <DestinationCategories categories={destinationCategories} />
        </Suspense>
      </ErrorBoundary>
      
      <ErrorBoundary id="content-section">
        <Suspense fallback={<div className="py-12 text-center">Loading content...</div>}>
          <FeaturedHotel hotel={featuredHotel} />
          <PopularDestinations 
            featured={destinations.featured} 
            hotels={destinations.hotels} 
          />
          <RestaurantFeature restaurants={restaurantPicks} />
          <HotelCategories categories={hotelCategories} />
          <WorldMapSection regions={mapRegions} />
          <JournalSection articles={journalArticles} />
          <NewsletterSignup />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}