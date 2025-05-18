import { NextRequest, NextResponse } from 'next/server';
import { getDestinationBySlug, getHotelsByDestination } from '@/lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Destination slug is required' },
        { status: 400 }
      );
    }

    const destination = await getDestinationBySlug(slug);
    
    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    // Fetch related hotels for this destination
    const hotels = await getHotelsByDestination(destination.id);
    
    // Combine destination data with hotels
    const responseData = {
      ...destination,
      hotels
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error(`Error fetching destination with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}