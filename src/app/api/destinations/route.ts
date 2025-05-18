import { NextRequest, NextResponse } from 'next/server';
import { getDestinations } from '@/lib/directus';

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

    // Fetch destinations
    const destinations = await getDestinations({ limit, offset, sort, filter, fields });

    return NextResponse.json(destinations, { status: 200 });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}