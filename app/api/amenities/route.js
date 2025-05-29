import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Fetch all active amenities with translations
    const response = await fetch(`${DIRECTUS_URL}/items/hotel_amenities?filter[status][_eq]=active&fields=*,translations.*&sort=sort`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch amenities: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process amenities to include localized names
    const amenities = data.data.map(amenity => {
      const translation = amenity.translations?.find(t => t.languages_code === locale) || 
                         amenity.translations?.find(t => t.languages_code === 'en');
      
      return {
        id: amenity.id,
        key: amenity.key,
        name: translation?.name || amenity.name,
        description: translation?.description || '',
        icon: amenity.icon,
        svg_icon: amenity.svg_icon,
        category: amenity.category,
        sort: amenity.sort
      };
    });

    return NextResponse.json({ amenities });
  } catch (error) {
    console.error('Error fetching amenities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}