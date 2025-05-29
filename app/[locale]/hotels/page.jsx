import HotelsPageClient from './HotelsPageClient';
import { getAllHotels, getAllCategories, getAllDestinations } from '@/lib/api';

export async function generateMetadata({ params }) {
  const { locale } = params;
  
  const metadata = {
    de: {
      title: 'Unsere Hotels - CinCin Hotels',
      description: 'Entdecken Sie unsere sorgfältig kuratierte Auswahl außergewöhnlicher Hotels, von Bergrückzugsorten bis zu urbanen Refugien.',
    },
    en: {
      title: 'Our Hotels - CinCin Hotels',
      description: 'Discover our carefully curated selection of exceptional hotels, from mountain retreats to urban sanctuaries.',
    }
  };

  return {
    ...metadata[locale] || metadata.en,
    openGraph: {
      ...metadata[locale] || metadata.en,
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
}

export default async function HotelsPage({ params, searchParams }) {
  const { locale } = params;
  
  // Fetch initial data with error handling
  let hotelsData = { data: [] };
  let categoriesData = { data: [] };
  let destinationsData = { data: [] };
  
  try {
    [hotelsData, categoriesData, destinationsData] = await Promise.all([
      getAllHotels(locale),
      getAllCategories(),
      getAllDestinations(),
    ]);
  } catch (error) {
    console.error('Error fetching hotels page data:', error);
  }

  return (
    <HotelsPageClient
      locale={locale}
      initialHotels={hotelsData?.data || []}
      categories={categoriesData?.data || []}
      destinations={destinationsData?.data || []}
      searchParams={searchParams}
    />
  );
}