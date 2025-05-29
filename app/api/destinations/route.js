import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    
    // Fetch destinations
    const destResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations?fields=*&filter[status][_eq]=published`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 600 }
      }
    );

    if (!destResponse.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const destinationsData = await destResponse.json();
    const destinationsList = destinationsData.data || [];

    // Fetch translations
    const transResponse = await fetch(
      `${DIRECTUS_URL}/items/destinations_translations?filter[language_code][_eq]=${locale}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 600 }
      }
    );

    let translations = [];
    if (transResponse.ok) {
      const translationsData = await transResponse.json();
      translations = translationsData.data || [];
    }

    // Image mapping
    const imageMapping = {
      'mykonos': 'beach.jpg',
      'crans-montana': 'mountain.jpg',
      'south-tyrol': 'south-tyrol.jpg',
      'berchtesgaden': 'mountain.jpg'
    };

    // Merge destinations with translations
    const destinationsWithTranslations = destinationsList.map(destination => {
      const translation = translations.find(t => t.destination_id === destination.id);
      
      // Handle images
      let imageUrl;
      if (destination.image && Array.isArray(destination.image) && destination.image.length > 0) {
        imageUrl = `${DIRECTUS_URL}/assets/${destination.image[0].directus_files_id}`;
      } else if (destination.image && typeof destination.image === 'string') {
        imageUrl = `${DIRECTUS_URL}/assets/${destination.image}`;
      } else {
        const mappedImage = imageMapping[destination.slug] || `${destination.slug}.jpg`;
        imageUrl = `/images/destinations/${mappedImage}`;
      }
      
      let heroImageUrl;
      if (destination.hero_image) {
        heroImageUrl = `${DIRECTUS_URL}/assets/${destination.hero_image}`;
      } else {
        heroImageUrl = imageUrl;
      }
      
      return {
        id: destination.id,
        slug: destination.slug,
        name: destination.name,
        image: imageUrl,
        hero_image: heroImageUrl,
        description: translation?.description || '',
        featured: destination.featured,
        latitude: destination.latitude,
        longitude: destination.longitude,
        status: destination.status
      };
    });

    return NextResponse.json({
      data: destinationsWithTranslations,
      meta: {
        total: destinationsWithTranslations.length
      }
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}