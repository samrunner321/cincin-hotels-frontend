import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import DiscoverDestinations from '../components/home/DiscoverDestinations';
import DestinationCategories from '../components/home/DestinationCategories';
import HotelCategories from '../components/home/HotelCategories';
import WorldMapSection from '../components/home/WorldMapSection';

// Dynamisches Importieren für Client-Komponenten ohne SSR
// Dies verhindert den "Event handlers cannot be passed to Client Component props"-Fehler
const Layout = dynamic(() => import('../components/layout/Layout'), { ssr: false });
const Hero = dynamic(() => import('../components/home/Hero'), { ssr: false });
const FeaturedHotel = dynamic(() => import('../components/home/FeaturedHotel'), { ssr: false });
const PopularDestinations = dynamic(() => import('../components/home/PopularDestinations'), { ssr: false });
const RestaurantFeature = dynamic(() => import('../components/home/RestaurantFeature'), { ssr: false });
const JournalSection = dynamic(() => import('../components/home/JournalSection'), { ssr: false });
const NewsletterSignup = dynamic(() => import('../components/home/NewsletterSignup'), { ssr: false });
const InteractiveFeatures = dynamic(() => import('../components/home/InteractiveFeatures'), { ssr: false });

// Metadata für SEO (ersetzt Head)
export const metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
};

// Datenabruffunktion für Server-Komponenten
async function getData() {
  // In einer echten App würden hier API-Aufrufe stehen
  // Für die Demo verwenden wir statische Daten
  
  return {
    featuredHotel: {
      tag: "New to the Club",
      name: "the cōmodo",
      location: "Bad Gastein, Austria",
      description: "the cōmodo in Bad Gastein offers a midcentury-inspired retreat with farm-to-table dining, a full spa, and a curated art collection. Perfect for families and wellness enthusiasts.",
      slug: "the-comodo",
      images: [
        "/images/hotel-1.jpg",
        "/images/hotel-2.jpg",
        "/images/hotel-3.jpg"
      ]
    },
    destinations: {
      featured: {
        name: "South Tyrol",
        image: "/images/south-tyrol.jpg",
        url: "/destinations/south-tyrol"
      },
      hotels: [
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
    hotelCategories: [
      {
        id: 1,
        name: "Culinary",
        image: "/images/category-culinary.jpg",
        url: "/hotels/category/culinary"
      },
      {
        id: 2,
        name: "Spa",
        image: "/images/category-spa.jpg",
        url: "/hotels/category/spa"
      },
      {
        id: 3,
        name: "City",
        image: "/images/category-city.jpg",
        url: "/hotels/category/city"
      },
      {
        id: 4,
        name: "Beach",
        image: "/images/category-beach.jpg",
        url: "/hotels/category/beach"
      },
      {
        id: 5,
        name: "Adults Only",
        image: "/images/category-adults.jpg",
        url: "/hotels/category/adults-only"
      }
    ],
    restaurantPicks: [
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
    ]
  };
}

export default async function HomePage() {
  const { featuredHotel, destinations, hotelCategories, restaurantPicks, journalArticles } = await getData();
  
  return (
    <Layout>
      {/* Verwende zwei Suspense-Boundaries für bessere Ladeerfahrung */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading hero section...</div>}>
        <Hero />
        <DiscoverDestinations />
        <DestinationCategories />
      </Suspense>
      
      <Suspense fallback={<div className="py-12 text-center">Loading content...</div>}>
        <FeaturedHotel {...featuredHotel} />
        <PopularDestinations 
          featured={destinations.featured} 
          hotels={destinations.hotels} 
        />
        <InteractiveFeatures />
        <RestaurantFeature restaurants={restaurantPicks} />
        <HotelCategories categories={hotelCategories} />
        <WorldMapSection />
        <JournalSection articles={journalArticles} />
        <NewsletterSignup />
      </Suspense>
    </Layout>
  );
}