import { NextRequest, NextResponse } from 'next/server';
import { getHotelBySlug } from '@/lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Hotel slug is required' },
        { status: 400 }
      );
    }

    const hotel = await getHotelBySlug(slug);
    
    if (!hotel) {
      return NextResponse.json(
        { error: 'Hotel not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(hotel, { status: 200 });
  } catch (error) {
    console.error(`Error fetching hotel with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel' },
      { status: 500 }
    );
  }
}