import { NextResponse } from 'next/server';
import { getNavigationPages } from '@/lib/directus';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch navigation pages
    const navigationItems = await getNavigationPages();

    return NextResponse.json(navigationItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}