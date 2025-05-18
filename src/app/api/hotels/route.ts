import { NextRequest, NextResponse } from 'next/server';
import { getHotels } from '@/lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort')?.split(',') || ['-date_created'];
    const filterParam = searchParams.get('filter');
    const fields = searchParams.get('fields')?.split(',') || ['*', 'main_image.*'];
    
    // Parse filter JSON if present
    const filter = filterParam ? JSON.parse(filterParam) : { status: { _eq: 'published' } };

    // Fetch hotels
    const hotels = await getHotels({ limit, offset, sort, filter, fields });

    return NextResponse.json(hotels, { status: 200 });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}