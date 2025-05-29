import { notFound } from 'next/navigation';
import HotelDetailPage from '@/components/hotel-detail/HotelDetailPage';

async function getHotelData(slug, locale) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/hotels/${slug}?locale=${locale}`,
      { 
        next: { revalidate: process.env.NEXT_PUBLIC_REVALIDATE_HOTEL ? parseInt(process.env.NEXT_PUBLIC_REVALIDATE_HOTEL) : 300 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  
  const hotel = await getHotelData(slug, locale);
  
  if (!hotel) {
    return {
      title: 'Hotel Not Found - CinCin Hotels',
      description: 'The requested hotel could not be found.'
    };
  }
  
  return {
    title: `${hotel.name} - CinCin Hotels`,
    description: hotel.shortDescription,
    alternates: {
      languages: {
        'de': `/de/hotels/${slug}`,
        'en': `/en/hotels/${slug}`,
      }
    },
    openGraph: {
      title: hotel.name,
      description: hotel.shortDescription,
      images: [
        {
          url: hotel.mainImage,
          width: 1200,
          height: 630,
          alt: hotel.name,
        }
      ],
    }
  };
}

export default async function HotelDetailRoute({ 
  params 
}) {
  const { locale, slug } = params;
  
  const hotel = await getHotelData(slug, locale);
  
  if (!hotel) {
    return notFound();
  }
  
  return <HotelDetailPage hotel={hotel} />;
}

// Generate static paths for known hotels
export async function generateStaticParams() {
  // For now, we'll use dynamic generation
  // In production, you'd fetch all hotel slugs from Directus
  return [];
}