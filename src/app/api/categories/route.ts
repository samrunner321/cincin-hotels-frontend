import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '../../../lib/directus';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'hotel' | 'destination' | 'both' | undefined;
    const featured = searchParams.has('featured')
      ? searchParams.get('featured') === 'true'
      : undefined;

    // Fetch categories
    const categories = await getCategories({ 
      type, 
      featured 
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}